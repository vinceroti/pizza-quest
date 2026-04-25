import '@/styles/pages/dashboard.scss';

import Image from 'next/image';

interface EmptyStateProps {
	title?: string;
	message?: string;
}

export default function EmptyState({
	title = 'No slices yet',
	message = 'Be the first to rate a pizza!',
}: EmptyStateProps) {
	return (
		<div className="flex flex-col items-center justify-center py-16 px-4">
			<div className="relative mb-6 empty-state__image">
				<Image
					src="/pizza-slice-single.webp"
					alt=""
					fill
					className="object-contain"
				/>
			</div>
			<h5 className="mb-2 empty-state__title">{title}</h5>
			<p className="empty-state__message">{message}</p>
		</div>
	);
}
