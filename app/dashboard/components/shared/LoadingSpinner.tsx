import '@/styles/pages/dashboard.scss';

import Image from 'next/image';

export default function LoadingSpinner() {
	return (
		<div
			role="status"
			aria-label="Loading"
			className="flex flex-col items-center justify-center mt-32"
		>
			<Image
				src="/pizza-slice.gif"
				alt=""
				width={80}
				height={80}
				className="animate-spin-slow"
				unoptimized
			/>
			<p className="mt-4 text-sm loading-text">Loading...</p>
		</div>
	);
}
