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
}

export default function Dashboard({ stats, tableData }: DashboardProps) {
	const { data: session } = useSession();
	const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

	return (
		<div className="w-full max-width">
			<h4 className="mb-1">Welcome back, {session?.user?.username}</h4>
			<p className="mb-6 dashboard-subtitle">
				Your pizza quest at a glance
			</p>

			<DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />

			{activeTab === 'overview' && <OverviewPanel stats={stats} />}
			{activeTab === 'my-places' && (
				<Table initialData={tableData} filter="self" />
			)}
			{activeTab === 'all-places' && (
				<Table initialData={tableData} filter="all" />
			)}
		</div>
	);
}
