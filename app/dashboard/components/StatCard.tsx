import '@/styles/pages/dashboard.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface StatCardProps {
	icon: string;
	iconColorClass: string;
	label: string;
	value: string | number;
	subValue?: React.ReactNode;
}

export default function StatCard({
	icon,
	iconColorClass,
	label,
	value,
	subValue,
}: StatCardProps) {
	return (
		<div className="glass-card flex flex-col items-center p-5 rounded-xl min-w-0">
			<FontAwesomeIcon
				icon={icon as never}
				className={`mb-3 stat-card__icon ${iconColorClass}`}
			/>
			<span className="text-2xl font-bold mb-1 stat-card__value">
				{value}
			</span>
			<span className="text-xs uppercase tracking-wider stat-card__label">
				{label}
			</span>
			{subValue && (
				<div className="mt-2 text-sm stat-card__sub-value">{subValue}</div>
			)}
		</div>
	);
}
