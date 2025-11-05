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
					<FontAwesomeIcon icon="user" className="mr-2" />
					<Link href={`/dashboard/profile/${session?.user?.username}`}>
						{session?.user?.username}
					</Link>
				</li>
				<li>
					<Link href="/dashboard" className="flex items-center gap-2">
						<FontAwesomeIcon icon="home" />
						<span>Home</span>
					</Link>
				</li>
				<li>
					<Link href="/dashboard/timeline" className="flex items-center gap-2">
						<FontAwesomeIcon icon="clock" />
						<span>Timeline</span>
					</Link>
				</li>
				<li>
					<Link href="/dashboard/new" className="flex items-center gap-2">
						<FontAwesomeIcon icon="plus" />
						<span>Submit Pizza</span>
					</Link>
				</li>
				<li>
					<Link href="/dashboard/settings" className="flex items-center gap-2">
						<FontAwesomeIcon icon="cog" />
						<span>Settings</span>
					</Link>
				</li>
				<li>
					<button
						className="button-link flex items-center gap-2"
						onClick={() => signOut()}
					>
						<FontAwesomeIcon icon="right-from-bracket" />
						<span>Logout</span>
					</button>
				</li>
			</ul>
		</nav>
	);
}
