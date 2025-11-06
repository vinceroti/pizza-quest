import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	CircularProgress,
	List,
	ListItem,
	ListItemText,
	TextField,
} from '@mui/material';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';

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
	const containerRef = useRef<HTMLDivElement>(null);

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
		}, 500); // 500ms debounce time

		setIsLoading(true);

		return () => {
			clearTimeout(handler);
			setIsLoading(false);
		};
	}, [inputValue]);

	const handleInputChangeLocal = (event: ChangeEvent<HTMLInputElement>) => {
		setInputValue(event.target.value);
	};

	const handleSuggestionClick = (suggestion: GooglePrediction) => {
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
	};

	const handleClear = () => {
		setInputValue('');
		handleInputChange(null);
		setSuggestions([]);
		setIsDisabled(false);
	};

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

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isDisabled]);

	return (
		<div
			ref={containerRef}
			className="relative w-full max-w-md mx-auto mt-8 mb-3"
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
					className="mb-2"
					required
					disabled={isDisabled}
				/>
				{isDisabled ? (
					<button
						onClick={handleClear}
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
			{suggestions.length > 0 && !isDisabled && !isLoading && (
				<List
					sx={{
						position: 'absolute',
						zIndex: 1000,
						backgroundColor: 'white',
						width: '100%',
						border: '1px solid #ccc',
						borderRadius: '4px',
						maxHeight: '200px',
						overflowY: 'auto',
						color: 'black',
					}}
				>
					{suggestions.map((suggestion) => (
						<button
							onClick={() => handleSuggestionClick(suggestion)}
							key={suggestion.place_id}
							className="w-full text-left hover:bg-gray-100"
						>
							<ListItem key={suggestion.place_id}>
								<ListItemText primary={suggestion.description} />
							</ListItem>
						</button>
					))}
				</List>
			)}
		</div>
	);
};

export default PizzaPlaceAutoComplete;
