import { notFound } from 'next/navigation';

import { getPizzaPlaceDetails, protectedRedirect } from '@/app/actions';

import PlaceDetails from './PlaceDetails';

interface PageProps {
	params: {
		placeId: string;
	};
}

export default async function Page({ params }: PageProps) {
	await protectedRedirect();

	const details = await getPizzaPlaceDetails(params.placeId);

	if (!details) {
		notFound();
	}

	return <PlaceDetails details={details} />;
}
