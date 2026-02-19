import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	CircularProgress,
	List,
	ListItem,
	ListItemText,
	TextField,
} from '@mui/material';
import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';

import { searchPizzaPlaces } from '@/app/actions';
import GooglePrediction from '@/interfaces/models/GooglePrediction';

interface PizzaPlaceAutoCompleteProps {
	handleInputChange: (event: GooglePrediction | null) => void;
}

const PizzaPlaceAutoComplete: React.FC<PizzaPlaceAutoCompleteProps> = ({
	handleInputChange,
}) => {
	const [inputValue, setInputValue] = useState<string>('');
	const [suggestions, setSuggestions] = useState<GooglePrediction[]>([]);
	const [isDisabled, setIsDisabled] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
	const containerRef = useRef<HTMLDivElement>(null);
	const listRef = useRef<HTMLUListElement>(null);

	useEffect(() => {
		const fetchSuggestions = async (input: string) => {
			try {
				const data = await searchPizzaPlaces(input);
				setSuggestions(data);
			} catch (error) {
				console.error('Error fetching suggestions:', error);
			} finally {
				setIsLoading(false);
			}
		};

		const handler = setTimeout(() => {
			if (inputValue.length > 2) {
				fetchSuggestions(inputValue);
			} else {
				setSuggestions([]);
				setIsLoading(false);
			}
		}, 500);

		setIsLoading(true);

		return () => {
			clearTimeout(handler);
			setIsLoading(false);
		};
	}, [inputValue]);

	const handleInputChangeLocal = (event: ChangeEvent<HTMLInputElement>) => {
		setInputValue(event.target.value);
		setHighlightedIndex(-1);
	};

	const handleSuggestionClick = useCallback(
		(suggestion: GooglePrediction) => {
			setInputValue(suggestion.description);
			handleInputChange({
				description: suggestion.description,
				place_id: suggestion.place_id,
				structured_formatting: {
					secondary_text: suggestion.structured_formatting.secondary_text,
					main_text: suggestion.structured_formatting.main_text,
				},
			});
			setSuggestions([]);
			setIsDisabled(true);
			setHighlightedIndex(-1);
		},
		[handleInputChange],
	);

	const handleClear = () => {
		setInputValue('');
		handleInputChange(null);
		setSuggestions([]);
		setIsDisabled(false);
		setHighlightedIndex(-1);
	};

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent) => {
			if (suggestions.length === 0 || isDisabled) return;

			switch (event.key) {
				case 'ArrowDown':
					event.preventDefault();
					setHighlightedIndex((prev) =>
						prev < suggestions.length - 1 ? prev + 1 : 0,
					);
					break;
				case 'ArrowUp':
					event.preventDefault();
					setHighlightedIndex((prev) =>
						prev > 0 ? prev - 1 : suggestions.length - 1,
					);
					break;
				case 'Enter':
					event.preventDefault();
					if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
						handleSuggestionClick(suggestions[highlightedIndex]);
					}
					break;
				case 'Escape':
					setSuggestions([]);
					setHighlightedIndex(-1);
					break;
			}
		},
		[suggestions, isDisabled, highlightedIndex, handleSuggestionClick],
	);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				if (!isDisabled) {
					setInputValue('');
					setSuggestions([]);
				}
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isDisabled]);

	const showSuggestions = suggestions.length > 0 && !isDisabled && !isLoading;

	return (
		<div
			ref={containerRef}
			className="relative w-full max-w-md mx-auto mt-8 mb-3"
			role="combobox"
			aria-expanded={showSuggestions}
			aria-haspopup="listbox"
			aria-controls="pizza-place-listbox"
		>
			<div
				style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
			>
				<TextField
					label="Search for Pizza Places"
					variant="outlined"
					fullWidth
					value={inputValue}
					onChange={handleInputChangeLocal}
					onKeyDown={handleKeyDown}
					className="mb-2"
					required
					disabled={isDisabled}
					aria-autocomplete="list"
					aria-controls={showSuggestions ? 'pizza-place-listbox' : undefined}
					aria-activedescendant={
						highlightedIndex >= 0
							? `pizza-suggestion-${highlightedIndex}`
							: undefined
					}
				/>
				{isDisabled ? (
					<button
						onClick={handleClear}
						aria-label="Clear selection"
						style={{
							position: 'absolute',
							right: 10,
							top: '50%',
							transform: 'translateY(-50%)',
							background: 'none',
							border: 'none',
							cursor: 'pointer',
						}}
					>
						<FontAwesomeIcon icon={faTimes} />
					</button>
				) : (
					isLoading && (
						<CircularProgress
							size={24}
							color="secondary"
							style={{
								position: 'absolute',
								right: 10,
								transform: 'translateY(-50%)',
							}}
						/>
					)
				)}
			</div>
			{showSuggestions && (
				<List
					ref={listRef}
					id="pizza-place-listbox"
					role="listbox"
					sx={{
						position: 'absolute',
						zIndex: 1000,
						backgroundColor: 'rgba(30, 58, 95, 0.95)',
						backdropFilter: 'blur(10px)',
						width: '100%',
						border: '1px solid rgba(77, 144, 254, 0.3)',
						borderRadius: '4px',
						maxHeight: '200px',
						overflowY: 'auto',
						color: 'text.primary',
					}}
				>
					{suggestions.map((suggestion, index) => (
						<ListItem
							key={suggestion.place_id}
							id={`pizza-suggestion-${index}`}
							role="option"
							aria-selected={index === highlightedIndex}
							onClick={() => handleSuggestionClick(suggestion)}
							sx={{
								cursor: 'pointer',
								backgroundColor:
									index === highlightedIndex
										? 'rgba(77, 144, 254, 0.2)'
										: 'transparent',
								'&:hover': {
									backgroundColor: 'rgba(255, 255, 255, 0.1)',
								},
							}}
						>
							<ListItemText primary={suggestion.description} />
						</ListItem>
					))}
				</List>
			)}
		</div>
	);
};

export default PizzaPlaceAutoComplete;
