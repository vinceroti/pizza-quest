import Image from 'next/image';

type SuccessMessageProps = {
	title?: string;
	message?: string;
};

export default function SuccessMessage({
	title = 'Hot out the oven!',
	message = 'Your slice is logged. Mangia.',
}: SuccessMessageProps) {
	return (
		<div className="mt-20 text-center">
			<h4>{title}</h4>
			<div className="success-pizza">
				<Image
					src="/pizza-slice.gif"
					alt=""
					width={120}
					height={120}
					unoptimized
				/>
			</div>
			<p>{message}</p>
		</div>
	);
}
