import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function LoadingSpinner() {
	return (
		<FontAwesomeIcon
			icon="circle-notch"
			className="animate-spin mt-44 mx-auto"
			size="3x"
		/>
	);
}
