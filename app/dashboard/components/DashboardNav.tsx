'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';

export default function DashboardNav() {
	const { data: session } = useSession();
	return (
		<nav className="flex items-center justify-between p-6 w-full text-right bg-blue-700">
			<ul className="flex space-x-4 justify-end w-full max-width m-auto">
				<li className="mr-auto">
					<FontAwesomeIcon icon="user" /> {session?.user?.username}
				</li>
				<li>
					<Link href="/dashboard">Home</Link>
				</li>
				<li>
					<Link href="/dashboard/new">Submit Pizza</Link>
				</li>
				<li>
					<Link href="/dashboard/settings">Settings</Link>
				</li>
				<li>
					<button className="button-link" onClick={() => signOut()}>
						Logout
					</button>
				</li>
			</ul>
		</nav>
	);
}
