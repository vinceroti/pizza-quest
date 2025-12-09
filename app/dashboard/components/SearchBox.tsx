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
		<div className="relative w-full max-w-md mx-auto mt-4 mb-2">
			<TextField
				label={label}
				placeholder={placeholder}
				variant="outlined"
				fullWidth
				value={inputValue}
				onChange={handleInputChange}
				className="mb-2"
				size="medium"
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
									style={{
										background: 'none',
										border: 'none',
										cursor: 'pointer',
										padding: 0,
										display: 'flex',
										alignItems: 'center',
									}}
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
