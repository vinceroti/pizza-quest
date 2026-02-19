import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function LoadingSpinner() {
	return (
		<div role="status" aria-label="Loading" className="flex justify-center">
			<FontAwesomeIcon
				icon="circle-notch"
				className="animate-spin mt-44 mx-auto"
				size="3x"
			/>
		</div>
	);
}
