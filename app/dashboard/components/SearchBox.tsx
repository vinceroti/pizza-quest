import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CircularProgress, TextField } from '@mui/material';
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
		<div className="relative w-full max-w-md mx-auto mt-8 mb-3">
			<div
				style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
			>
				<TextField
					label={label}
					placeholder={placeholder}
					variant="outlined"
					fullWidth
					value={inputValue}
					onChange={handleInputChange}
					className="mb-2"
				/>
				{inputValue && !isLoading ? (
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
		</div>
	);
};

export default SearchBox;
