import Image from 'next/image';

interface PizzaIconProps {
	size?: number;
	className?: string;
	style?: React.CSSProperties;
}

export default function PizzaIcon({
	size = 16,
	className = '',
	style,
}: PizzaIconProps) {
	return (
		<Image
			src="/pizza-slice.webp"
			alt="Pizza slice"
			width={size}
			height={size}
			className={className}
			style={{
				objectFit: 'contain',
				display: 'inline-block',
				...style,
			}}
		/>
	);
}
