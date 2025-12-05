'use client';

import '@/styles/pages/index.scss';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function SpaceBackground() {
	const [stars, setStars] = useState<
		Array<{ x: number; y: number; size: number; delay: number }>
	>([]);

	useEffect(() => {
		// Generate random stars
		const starArray = Array.from({ length: 100 }).map(() => ({
			x: Math.random() * 100,
			y: Math.random() * 100,
			size: Math.random() * 3 + 1,
			delay: Math.random() * 3,
		}));
		setStars(starArray);
	}, []);

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ ease: 'easeInOut', duration: 1 }}
			className="fixed inset-0 -z-1"
		>
			{/* Animated stars */}
			{stars.map((star, index) => (
				<div
					key={index}
					className="star absolute rounded-full bg-white"
					style={{
						left: `${star.x}%`,
						top: `${star.y}%`,
						width: `${star.size}px`,
						height: `${star.size}px`,
						animationDelay: `${star.delay}s`,
						boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.8)`,
					}}
				/>
			))}
		</motion.div>
	);
}
