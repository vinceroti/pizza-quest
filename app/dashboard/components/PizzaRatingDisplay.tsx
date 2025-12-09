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
					className="inline-block"
					style={{ objectFit: 'contain' }}
				/>
			))}
			{hasHalfSlice && (
				<span
					className="relative inline-flex"
					style={{ width: 16, height: 16 }}
				>
					<Image
						src="/pizza-slice-single.webp"
						alt="Half pizza slice"
						width={16}
						height={16}
						className="opacity-30"
						style={{ objectFit: 'contain' }}
					/>
					<Image
						src="/pizza-slice-single.webp"
						alt="Half pizza slice colored"
						width={16}
						height={16}
						className="absolute top-0 left-0"
						style={{
							objectFit: 'contain',
							clipPath: 'inset(0 50% 0 0)',
						}}
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
					className="inline-block opacity-30"
					style={{ objectFit: 'contain' }}
				/>
			))}
		</div>
	);
}
