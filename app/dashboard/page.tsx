import { protectedRedirect } from '~/actions';

import Dashboard from './Dashboard';
export default async function Page() {
	await protectedRedirect();
	return <Dashboard />;
}
