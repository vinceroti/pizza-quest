'use client';

import { useSession } from 'next-auth/react';

import PizzaSliceFeed, {
	type PizzaSliceFeedData,
} from '../components/PizzaSliceFeed';

interface TimelineProps {
	initialFeedData: PizzaSliceFeedData;
}

export default function Timeline({ initialFeedData }: TimelineProps) {
	const { data: session } = useSession();

	return (
		<PizzaSliceFeed
			userId={session?.user?.id}
			initialData={initialFeedData}
		/>
	);
}
