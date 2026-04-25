'use client';

import '@/styles/pages/dashboard.scss';

import { Prisma } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

import type { getDashboardStats } from '@/app/actions';

import DashboardTabs, { type DashboardTab } from './components/DashboardTabs';
import OverviewPanel from './components/OverviewPanel';
import Table, { type PizzaPlaceData } from './components/Table';

type DashboardStats = Prisma.PromiseReturnType<typeof getDashboardStats>;

interface DashboardProps {
	stats: DashboardStats;
	tableData: PizzaPlaceData;
	userRatedPlaceIds: string[];
}

export default function Dashboard({
	stats,
	tableData,
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
				<Table
					initialData={tableData}
					filter="self"
					focusedPlaceId={focusedPlaceId}
					userRatedPlaceIds={userRatedPlaceIds}
				/>
			)}
			{activeTab === 'all-places' && (
				<Table
					initialData={tableData}
					filter="all"
					focusedPlaceId={focusedPlaceId}
					userRatedPlaceIds={userRatedPlaceIds}
				/>
			)}
		</div>
	);
}
