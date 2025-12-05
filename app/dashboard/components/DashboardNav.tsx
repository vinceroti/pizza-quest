'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

import PizzaIcon from '@/components/PizzaIcon';

export default function DashboardNav() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const pathname = usePathname();
	const textShadow = '1px 3px 3px rgba(0, 0, 0, 0.5)';

	return (
		<nav className="p-6 w-full dashboard-nav sticky -top-[1px] z-10">
			<div className="flex items-center justify-between w-full max-width m-auto">
				{/* Header - always visible */}
				<div className="flex items-center">
					<PizzaIcon
						size={30}
						className="mr-3 mt-1"
						style={{
							filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4))',
						}}
					/>
					<h1
						className="text-center m-0 font-semibold text-2xl"
						style={{ textShadow }}
					>
						Pizza Quest
					</h1>
				</div>

				{/* Hamburger button - only visible on mobile */}
				<button
					className="md:hidden text-white relative w-6 h-6"
					onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					aria-label="Toggle menu"
					type="button"
				>
					<AnimatePresence>
						{mobileMenuOpen ? (
							<motion.div
								key="times"
								initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
								animate={{ opacity: 1, rotate: 0, scale: 1 }}
								exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
								transition={{ duration: 0.3, ease: 'easeInOut' }}
								className="absolute inset-0 flex items-center justify-center"
							>
								<FontAwesomeIcon icon="times" size="lg" />
							</motion.div>
						) : (
							<motion.div
								key="bars"
								initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
								animate={{ opacity: 1, rotate: 0, scale: 1 }}
								exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
								transition={{ duration: 0.3, ease: 'easeInOut' }}
								className="absolute inset-0 flex items-center justify-center"
							>
								<FontAwesomeIcon icon="bars" size="lg" />
							</motion.div>
						)}
					</AnimatePresence>
				</button>

				{/* Desktop menu - hidden on mobile */}
				<ul className="hidden md:flex space-x-7">
					<li>
						<Link
							href="/dashboard"
							className={`flex items-center gap-2 ${pathname === '/dashboard' ? 'active' : ''}`}
						>
							<FontAwesomeIcon icon="home" />
							<span>Home</span>
						</Link>
					</li>
					<li>
						<Link
							href="/dashboard/timeline"
							className={`flex items-center gap-2 ${pathname === '/dashboard/timeline' ? 'active' : ''}`}
						>
							<FontAwesomeIcon icon="clock" />
							<span>Timeline</span>
						</Link>
					</li>
					<li>
						<Link
							href="/dashboard/new"
							className={`flex items-center gap-2 ${pathname === '/dashboard/new' ? 'active' : ''}`}
						>
							<FontAwesomeIcon icon="plus" />
							<span>Submit Pizza</span>
						</Link>
					</li>
					<li>
						<Link
							href="/dashboard/settings"
							className={`flex items-center gap-2 ${pathname === '/dashboard/settings' ? 'active' : ''}`}
						>
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
			</div>

			{/* Mobile menu - only visible when open */}
			<AnimatePresence>
				{mobileMenuOpen && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: 'auto', opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.3, ease: 'easeInOut' }}
						className="md:hidden"
					>
						<ul className="flex flex-col space-y-4 pt-6 pb-3 ">
							<li>
								<Link
									href="/dashboard"
									className={`flex items-center gap-2 ${pathname === '/dashboard' ? 'active' : ''}`}
									onClick={() => setMobileMenuOpen(false)}
								>
									<FontAwesomeIcon icon="home" />
									<span>Home</span>
								</Link>
							</li>
							<li>
								<Link
									href="/dashboard/timeline"
									className={`flex items-center gap-2 ${
										pathname === '/dashboard/timeline' ? 'active' : ''
									}`}
									onClick={() => setMobileMenuOpen(false)}
								>
									<FontAwesomeIcon icon="clock" />
									<span>Timeline</span>
								</Link>
							</li>
							<li>
								<Link
									href="/dashboard/new"
									className={`flex items-center gap-2 ${
										pathname === '/dashboard/new' ? 'active' : ''
									}`}
									onClick={() => setMobileMenuOpen(false)}
								>
									<FontAwesomeIcon icon="plus" />
									<span>Submit Pizza</span>
								</Link>
							</li>
							<li>
								<Link
									href="/dashboard/settings"
									className={`flex items-center gap-2 ${
										pathname === '/dashboard/settings' ? 'active' : ''
									}`}
									onClick={() => setMobileMenuOpen(false)}
								>
									<FontAwesomeIcon icon="cog" />
									<span>Settings</span>
								</Link>
							</li>
							<li>
								<button
									className="button-link flex items-center gap-2"
									onClick={() => {
										setMobileMenuOpen(false);
										signOut();
									}}
								>
									<FontAwesomeIcon icon="right-from-bracket" />
									<span>Logout</span>
								</button>
							</li>
						</ul>
					</motion.div>
				)}
			</AnimatePresence>
		</nav>
	);
}
