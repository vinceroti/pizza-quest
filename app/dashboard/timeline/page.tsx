import { getAllPizzaSliceData } from '@/app/actions';

import Timeline from './Timeline';

export default async function Page() {
	const feedData = await getAllPizzaSliceData();

	return <Timeline initialFeedData={feedData} />;
}
