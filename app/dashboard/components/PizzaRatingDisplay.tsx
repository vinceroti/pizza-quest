import Image from 'next/image';

type PizzaRatingDisplayProps = {
	rating?: number;
	className?: string;
};

export default function PizzaRatingDisplay({
	rating,
	className = '',
}: PizzaRatingDisplayProps) {
	if (!rating) {
		return null;
	}

	const fullSlices = Math.floor(rating);
	const hasHalfSlice = rating % 1 !== 0;
	const emptySlices = 5 - fullSlices - (hasHalfSlice ? 1 : 0);

	return (
		<div className={`flex items-center gap-0.5 ${className}`}>
			{Array.from({ length: fullSlices }).map((_, index) => (
				<Image
					key={`full-${index}`}
					src="/pizza-slice-single.webp"
					alt="Pizza slice"
					width={16}
					height={16}
					className="pizza-icon"
				/>
			))}
			{hasHalfSlice && (
				<span className="relative inline-flex pizza-rating__half-container">
					<Image
						src="/pizza-slice-single.webp"
						alt="Half pizza slice"
						width={16}
						height={16}
						className="opacity-30 pizza-icon"
					/>
					<Image
						src="/pizza-slice-single.webp"
						alt="Half pizza slice colored"
						width={16}
						height={16}
						className="absolute top-0 left-0 pizza-rating__half-clip"
					/>
				</span>
			)}
			{Array.from({ length: emptySlices }).map((_, index) => (
				<Image
					key={`empty-${index}`}
					src="/pizza-slice-single.webp"
					alt="Empty pizza slice"
					width={16}
					height={16}
					className="pizza-icon opacity-30"
				/>
			))}
		</div>
	);
}
