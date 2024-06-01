'use client';

import { CircularProgress } from '@mui/material';
import { useSession } from 'next-auth/react'; // Import useSession

export default function AppLoading() {
	const { status } = useSession(); // Get the session status

	if (status === 'loading') {
		return <CircularProgress className="fixed top-1/3 left-1/2" />;
	}
	return null;
}
