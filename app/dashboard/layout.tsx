'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

export default function Layout({ children }) {
	const { data: session } = useSession();

	return (
		<div className="w-full h-full flex-1 bg-blue-500 text-white rounded-md shadow-lg">
			<nav className="flex items-center justify-between p-6 w-full text-right bg-blue-700 rounded-t-md">
				<ul className="flex space-x-4 justify-end w-full">
					<li>{session?.user?.username}</li>
					<li>
						<Link href="/settings">Settings</Link>
					</li>
					<li>
						<button onClick={() => signOut()}>Logout</button>
					</li>
				</ul>
			</nav>
			<div className="p-1">{children}</div>
		</div>
	);
}
