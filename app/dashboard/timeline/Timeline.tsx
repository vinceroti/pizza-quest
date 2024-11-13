'use client';

import { useSession } from 'next-auth/react';

import PizzaSliceFeed from '../components/PizzaSliceFeed';

export default function Timeline() {
	const { data: session } = useSession();

	return (
		<div>
			<h6>Timeline</h6>
			<PizzaSliceFeed userId={session?.user?.id} />
		</div>
	);
}
