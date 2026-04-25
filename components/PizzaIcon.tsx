import Image from 'next/image';

interface PizzaIconProps {
	size?: number;
	className?: string;
}

export default function PizzaIcon({
	size = 16,
	className = '',
}: PizzaIconProps) {
	return (
		<Image
			src="/pizza-slice.webp"
			alt="Pizza slice"
			width={size}
			height={size}
			className={`pizza-icon ${className}`}
		/>
	);
}
