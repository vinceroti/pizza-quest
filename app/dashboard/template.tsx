'use client';

import { motion } from 'framer-motion';

export default function Transition({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<motion.div
			initial={{ y: 20, opacity: 0 }}
			animate={{ y: 1, opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ ease: 'easeInOut', duration: 0.75 }}
			className="w-full h-full flex flex-col items-center justify-center flex-1"
		>
			{children}
		</motion.div>
	);
}
