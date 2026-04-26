import '@/styles/pages/dashboard.scss';

import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CircularProgress, InputAdornment, TextField } from '@mui/material';
import React, { ChangeEvent, useEffect, useState } from 'react';

interface SearchBoxProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	label?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({
	value,
	onChange,
	placeholder = 'Search...',
	label = 'Search for Pizza Places',
}) => {
	const [inputValue, setInputValue] = useState<string>(value);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		setIsLoading(true);

		const handler = setTimeout(() => {
			onChange(inputValue);
			setIsLoading(false);
		}, 500); // 500ms debounce time

		return () => {
			clearTimeout(handler);
		};
	}, [inputValue, onChange]);

	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		setInputValue(event.target.value);
	};

	const handleClear = () => {
		setInputValue('');
		onChange('');
		setIsLoading(false);
	};

	return (
		<div className="search-box relative w-full">
			<TextField
				label={label}
				placeholder={placeholder}
				variant="outlined"
				fullWidth
				value={inputValue}
				onChange={handleInputChange}
				size="medium"
				inputProps={{
					autoCapitalize: 'none',
					autoCorrect: 'off',
					autoComplete: 'off',
					spellCheck: 'false',
				}}
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<FontAwesomeIcon
								icon="search"
								className={`${!inputValue ? 'opacity-50' : ''} transition-opacity duration-200`}
							/>
						</InputAdornment>
					),
					endAdornment: (
						<InputAdornment position="end">
							{inputValue && !isLoading ? (
								<button
									onClick={handleClear}
									aria-label="Clear search"
									className="icon-button-reset"
								>
									<FontAwesomeIcon icon={faTimes} />
								</button>
							) : (
								isLoading && <CircularProgress size={20} color="secondary" />
							)}
						</InputAdornment>
					),
				}}
			/>
		</div>
	);
};

export default SearchBox;
