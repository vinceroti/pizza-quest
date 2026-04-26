import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import SearchBox from '../shared/SearchBox';

export type SortField = 'name' | 'rating';
export type SortDirection = 'asc' | 'desc';

interface PlaceListControlsProps {
	searchQuery: string;
	onSearchChange: (value: string) => void;
	sortField: SortField;
	sortDirection: SortDirection;
	onSortChange: (field: SortField) => void;
}

export default function PlaceListControls({
	searchQuery,
	onSearchChange,
	sortField,
	sortDirection,
	onSortChange,
}: PlaceListControlsProps) {
	return (
		<div className="place-list-controls">
			<div className="place-list-controls__search">
				<SearchBox value={searchQuery} onChange={onSearchChange} />
			</div>

			<div className="list-sort" role="group" aria-label="Sort">
				<span className="list-sort__label">Sort</span>
				<div className="list-sort__pills">
					<SortPill
						field="name"
						label="Name"
						icon="pizza-slice"
						activeField={sortField}
						direction={sortDirection}
						onClick={onSortChange}
					/>
					<SortPill
						field="rating"
						label="Rating"
						icon="star"
						activeField={sortField}
						direction={sortDirection}
						onClick={onSortChange}
					/>
				</div>
			</div>
		</div>
	);
}

interface SortPillProps {
	field: SortField;
	label: string;
	icon: 'star' | 'pizza-slice';
	activeField: SortField;
	direction: SortDirection;
	onClick: (field: SortField) => void;
}

function SortPill({
	field,
	label,
	icon,
	activeField,
	direction,
	onClick,
}: SortPillProps) {
	const active = activeField === field;
	return (
		<button
			type="button"
			onClick={() => onClick(field)}
			aria-pressed={active}
			className={`list-sort__option ${active ? 'list-sort__option--active' : ''}`}
		>
			<FontAwesomeIcon
				icon={icon}
				className={icon === 'star' && !active ? 'text-yellow-500' : ''}
			/>
			<span>{label}</span>
			{active && (
				<FontAwesomeIcon
					icon={direction === 'asc' ? 'chevron-up' : 'chevron-down'}
				/>
			)}
		</button>
	);
}
