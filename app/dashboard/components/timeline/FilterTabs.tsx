type FilterTabsProps = {
	activeFilter: 'self' | 'all';
	onFilterChange: (filter: 'self' | 'all') => void;
};

export default function FilterTabs({
	activeFilter,
	onFilterChange,
}: FilterTabsProps) {
	const baseStyles =
		'flex-1 py-4 px-8 font-semibold text-base transition-all duration-200 border-none';
	const activeStyles = 'bg-blue-500/30 text-white cursor-default';
	const inactiveStyles =
		'bg-[rgba(15,30,50,0.6)] text-gray-300 cursor-pointer hover:bg-blue-500/15 hover:text-white';

	return (
		<div
			className="flex border border-blue-400/30 rounded-lg overflow-hidden w-full max-w-md"
			role="tablist"
		>
			<button
				role="tab"
				aria-selected={activeFilter === 'self'}
				className={`${baseStyles} ${activeFilter === 'self' ? activeStyles : inactiveStyles}`}
				onClick={() => onFilterChange('self')}
				disabled={activeFilter === 'self'}
			>
				Self
			</button>
			<button
				role="tab"
				aria-selected={activeFilter === 'all'}
				className={`${baseStyles} border-l border-blue-400/30 ${
					activeFilter === 'all' ? activeStyles : inactiveStyles
				}`}
				onClick={() => onFilterChange('all')}
				disabled={activeFilter === 'all'}
			>
				All
			</button>
		</div>
	);
}
