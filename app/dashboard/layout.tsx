'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

export default function Layout({ children }) {
	const { data: session } = useSession();

	return (
		<div className="w-full h-full flex-1 bg-gradient-to-b from-blue-500 to-transparent text-white">
			<nav className="flex items-center justify-between p-6 w-full text-right bg-blue-700">
				<ul className="flex space-x-4 justify-end w-full">
					<li>{session?.user?.username}</li>
					<li>
						<Link href="/dashboard/new">Submit Pizza</Link>
					</li>
					<li>
						<Link href="/settings">Settings</Link>
					</li>
					<li>
						<button onClick={() => signOut()}>Logout</button>
					</li>
				</ul>
			</nav>
			<div className="p-4">{children}</div>
		</div>
	);
}
