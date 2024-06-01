'use client';

import { useSession } from 'next-auth/react';

export default function Dashboard() {
	const { data: session } = useSession();

	return (
		<div>
			<h6>Welcome, {session?.user?.username}</h6>
		</div>
	);
}
