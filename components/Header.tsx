import '@/styles/pages/index.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Header() {
	const textShadow = '1px 3px 3px rgba(0, 0, 0, 0.5)';

	return (
		<header className="flex items-center justify-center p-5 text-white">
			<FontAwesomeIcon icon="pizza-slice" size="2x" className="mr-3" />
			<h1
				className="text-4xl text-center m-0 font-semibold"
				style={{ textShadow }}
			>
				Pizza Quest
			</h1>
		</header>
	);
}
