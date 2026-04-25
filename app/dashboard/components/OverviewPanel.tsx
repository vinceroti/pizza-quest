import '@/styles/pages/dashboard.scss';

import { Prisma } from '@prisma/client';

import type { getDashboardStats } from '@/app/actions';

import HighlightCards from './HighlightCards';
import PizzaRatingDisplay from './PizzaRatingDisplay';
import StatCard from './StatCard';

type DashboardStats = Prisma.PromiseReturnType<typeof getDashboardStats>;

interface OverviewPanelProps {
	stats: DashboardStats;
}

export default function OverviewPanel({ stats }: OverviewPanelProps) {
	return (
		<div>
			<div className="grid gap-4 mb-8 stats-grid">
				<StatCard
					icon="pizza-slice"
					iconColorClass="icon-color--yellow"
					label="Your Ratings"
					value={stats.userRatingCount}
				/>
				<StatCard
					icon="star"
					iconColorClass="icon-color--yellow-light"
					label="Your Avg Rating"
					value={stats.userAvgRating || '—'}
					subValue={
						stats.userAvgRating ? (
							<PizzaRatingDisplay rating={stats.userAvgRating} />
						) : undefined
					}
				/>
				<StatCard
					icon="store"
					iconColorClass="icon-color--blue-light"
					label="Places Explored"
					value={stats.totalPlaces}
				/>
				<StatCard
					icon="chart-bar"
					iconColorClass="icon-color--blue"
					label="Total Ratings"
					value={stats.totalRatings}
				/>
			</div>

			<HighlightCards
				topRated={stats.topRated}
				mostPopularPlace={stats.mostPopularPlace}
			/>
		</div>
	);
}
