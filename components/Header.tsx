import '@/styles/pages/index.scss';

import Link from 'next/link';

import PizzaIcon from '@/components/PizzaIcon';

export default function Header() {
	return (
		<header className="flex items-center justify-center p-5 text-white">
			<Link
				href="/dashboard"
				className="flex items-center text-inherit no-underline"
			>
				<PizzaIcon
					size={60}
					className="mr-4 mt-2 pizza-icon--drop-shadow"
				/>
				<h1 className="text-4xl text-center m-0 font-semibold text-shadow">
					Pizza Quest
				</h1>
			</Link>
		</header>
	);
}
