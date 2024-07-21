'use client';

import { useSession } from 'next-auth/react';

import PizzaSliceFeed from './components/PizzaSliceFeed';

export default function Dashboard() {
	const { data: session } = useSession();

	return (
		<div>
			<h6>Welcome, {session?.user?.username}</h6>
			<PizzaSliceFeed userId={session?.user?.id} />
		</div>
	);
}
