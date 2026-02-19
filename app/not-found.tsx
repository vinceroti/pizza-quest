import { Button } from '@mui/material';
import Link from 'next/link';

export default function NotFound() {
	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
			<h1 className="text-6xl font-bold">404</h1>
			<h2 className="text-xl">Page Not Found</h2>
			<p className="text-gray-400 max-w-md">
				Looks like this pizza slice got lost on the way to your plate.
			</p>
			<Link href="/">
				<Button variant="contained">Back to Home</Button>
			</Link>
		</div>
	);
}
