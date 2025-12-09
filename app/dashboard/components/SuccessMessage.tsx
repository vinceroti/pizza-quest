import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type SuccessMessageProps = {
	title?: string;
	message?: string;
};

export default function SuccessMessage({
	title = 'Success!',
	message = 'Your submission was successful.',
}: SuccessMessageProps) {
	return (
		<div className="mt-20 text-center">
			<h4>{title}</h4>
			<FontAwesomeIcon
				icon={{ prefix: 'far', iconName: 'circle-check' }}
				className="light-green mb-5 mt-3"
				size="4x"
			/>
			<p>{message}</p>
		</div>
	);
}
