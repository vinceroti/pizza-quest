import { Box, Rating, Typography } from '@mui/material';
import Image from 'next/image';

type RatingInputProps = {
	label: string;
	value: number | null;
	onChange: (value: number | null) => void;
	name: string;
};

const PizzaIcon = ({ className }: { className?: string }) => (
	<Image
		src="/pizza-slice-single.webp"
		alt="Pizza slice"
		width={20}
		height={20}
		className={`inline-block ${className}`}
		style={{ objectFit: 'contain' }}
	/>
);

export default function RatingInput({
	label,
	value,
	onChange,
	name,
}: RatingInputProps) {
	return (
		<Box mb={2} mt={2}>
			<p className="mb-2">{label}</p>
			<Rating
				name={name}
				value={value}
				precision={0.5}
				onChange={(event, newValue) => {
					onChange(newValue);
				}}
				icon={<PizzaIcon />}
				emptyIcon={<PizzaIcon className="opacity-30" />}
			/>
		</Box>
	);
}
