import { protectedRedirect } from '~/actions';

import DashboardNav from './components/DashboardNav';
export default async function Layout({ children }) {
	await protectedRedirect();
	return (
		<div className="w-full h-full flex-1 to-transparent text-white">
			<DashboardNav />
			<div className="p-4">{children}</div>
		</div>
	);
}
