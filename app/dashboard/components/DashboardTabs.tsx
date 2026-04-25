import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export type DashboardTab = 'overview' | 'my-places' | 'all-places';

interface DashboardTabsProps {
	activeTab: DashboardTab;
	onTabChange: (tab: DashboardTab) => void;
}

const tabs: { id: DashboardTab; label: string; icon: string }[] = [
	{ id: 'overview', label: 'Overview', icon: 'chart-bar' },
	{ id: 'my-places', label: 'My Places', icon: 'table' },
	{ id: 'all-places', label: 'All Places', icon: 'table' },
];

export default function DashboardTabs({
	activeTab,
	onTabChange,
}: DashboardTabsProps) {
	const baseStyles = [
		'flex-1 py-3 px-4 font-semibold text-sm',
		'transition-all duration-200 border-none',
		'flex items-center justify-center gap-2',
	].join(' ');
	const activeStyles = 'bg-blue-500/30 text-white cursor-default';
	const inactiveStyles =
		'bg-[rgba(15,30,50,0.6)] text-gray-300 cursor-pointer hover:bg-blue-500/15 hover:text-white';

	return (
		<div
			className="flex border border-blue-400/30 rounded-lg overflow-hidden w-full max-w-md mx-auto mb-8"
			role="tablist"
		>
			{tabs.map((tab, index) => (
				<button
					key={tab.id}
					role="tab"
					aria-selected={activeTab === tab.id}
					className={`${baseStyles} ${index > 0 ? 'border-l border-blue-400/30' : ''} ${
						activeTab === tab.id ? activeStyles : inactiveStyles
					}`}
					onClick={() => onTabChange(tab.id)}
					disabled={activeTab === tab.id}
				>
					<FontAwesomeIcon icon={tab.icon as never} />
					{tab.label}
				</button>
			))}
		</div>
	);
}
