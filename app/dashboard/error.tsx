'use client';

import { Button } from '@mui/material';
import Link from 'next/link';

export default function DashboardError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center px-4">
			<h2 className="text-2xl">Something went wrong</h2>
			<p className="text-gray-400 max-w-md">
				{error.message || 'An unexpected error occurred.'}
			</p>
			<div className="flex gap-3">
				<Button variant="contained" onClick={reset}>
					Try Again
				</Button>
				<Link href="/dashboard">
					<Button variant="outlined">Go to Dashboard</Button>
				</Link>
			</div>
		</div>
	);
}
