'use client';

import { Snowfall } from 'react-snowfall/lib/Snowfall';

export default function SnowfallComponent() {
	return (
		<Snowfall
			style={{
				position: 'fixed',
				width: '100vw',
				height: '100vh',
				zIndex: -1,
			}}
			snowflakeCount={100}
		/>
	);
}
