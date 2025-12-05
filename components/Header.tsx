import '@/styles/pages/index.scss';

import PizzaIcon from '@/components/PizzaIcon';

export default function Header() {
	const textShadow = '1px 3px 3px rgba(0, 0, 0, 0.5)';

	return (
		<header className="flex items-center justify-center p-5 text-white">
			<PizzaIcon
				size={60}
				className="mr-4 mt-2"
				style={{
					filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4))',
				}}
			/>
			<h1
				className="text-4xl text-center m-0 font-semibold"
				style={{ textShadow }}
			>
				Pizza Quest
			</h1>
		</header>
	);
}
