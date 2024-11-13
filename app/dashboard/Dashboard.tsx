'use client';

import { useSession } from 'next-auth/react';

import Table from './components/Table';

export default function Dashboard() {
	const { data: session } = useSession();

	return (
		<div>
			<h6>Welcome, {session?.user?.username}</h6>
			<Table userId={session?.user?.id} />
		</div>
	);
}
