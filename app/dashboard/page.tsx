import {
	getAllPizzaPlacesWithRatings,
	getDashboardStats,
	getUserRatedPlaceIds,
	protectedRedirect,
} from '~/actions';

import Dashboard from './Dashboard';

export default async function Page() {
	await protectedRedirect();

	const [stats, placesData, userRatedPlaceIds] = await Promise.all([
		getDashboardStats(),
		getAllPizzaPlacesWithRatings(),
		getUserRatedPlaceIds(),
	]);

	return (
		<Dashboard
			stats={stats}
			placesData={placesData}
			userRatedPlaceIds={userRatedPlaceIds}
		/>
	);
}
