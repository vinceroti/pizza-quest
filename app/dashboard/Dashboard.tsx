'use client';

import '@/styles/pages/dashboard.scss';

import { Prisma } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

import type { getDashboardStats } from '@/app/actions';

import DashboardTabs, { type DashboardTab } from './components/nav/DashboardTabs';
import OverviewPanel from './components/overview/OverviewPanel';
import Places, { type PizzaPlaceData } from './components/places/Places';

type DashboardStats = Prisma.PromiseReturnType<typeof getDashboardStats>;

interface DashboardProps {
	stats: DashboardStats;
	placesData: PizzaPlaceData;
	userRatedPlaceIds: string[];
}

export default function Dashboard({
	stats,
	placesData,
	userRatedPlaceIds,
}: DashboardProps) {
	const { data: session } = useSession();
	const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
	const [focusedPlaceId, setFocusedPlaceId] = useState<string | null>(null);

	const focusPlace = (tab: DashboardTab, placeId: string) => {
		setActiveTab(tab);
		setFocusedPlaceId(placeId);
	};

	return (
		<div className="w-full max-width">
			<h4 className="mb-1">Hey, {session?.user?.username}</h4>
			<p className="mb-6 dashboard-subtitle">
				The quest for the greatest slice continues.
			</p>

			<DashboardTabs
				activeTab={activeTab}
				onTabChange={(tab) => {
					setActiveTab(tab);
					setFocusedPlaceId(null);
				}}
			/>

			{activeTab === 'overview' && (
				<OverviewPanel stats={stats} onFocusPlace={focusPlace} />
			)}
			{activeTab === 'my-places' && (
				<Places
					initialData={placesData}
					filter="self"
					focusedPlaceId={focusedPlaceId}
					userRatedPlaceIds={userRatedPlaceIds}
				/>
			)}
			{activeTab === 'all-places' && (
				<Places
					initialData={placesData}
					filter="all"
					focusedPlaceId={focusedPlaceId}
					userRatedPlaceIds={userRatedPlaceIds}
				/>
			)}
		</div>
	);
}
