import {
	getAllPizzaPlacesWithRatings,
	getDashboardStats,
	protectedRedirect,
} from '~/actions';

import Dashboard from './Dashboard';

export default async function Page() {
	await protectedRedirect();

	const [stats, tableData] = await Promise.all([
		getDashboardStats(),
		getAllPizzaPlacesWithRatings(),
	]);

	return <Dashboard stats={stats} tableData={tableData} />;
}
