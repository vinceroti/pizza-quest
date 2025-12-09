import './FilterTabs.scss';

type FilterTabsProps = {
	activeFilter: 'self' | 'all';
	onFilterChange: (filter: 'self' | 'all') => void;
};

export default function FilterTabs({
	activeFilter,
	onFilterChange,
}: FilterTabsProps) {
	return (
		<div className="filter-tabs">
			<button
				className={activeFilter === 'self' ? 'active' : ''}
				onClick={() => onFilterChange('self')}
				disabled={activeFilter === 'self'}
			>
				Self
			</button>
			<button
				className={activeFilter === 'all' ? 'active' : ''}
				onClick={() => onFilterChange('all')}
				disabled={activeFilter === 'all'}
			>
				All
			</button>
		</div>
	);
}
