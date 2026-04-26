import '@/styles/pages/dashboard.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Prisma } from '@prisma/client';
import Link from 'next/link';

import type { getDashboardStats } from '@/app/actions';

import type { DashboardTab } from '../nav/DashboardTabs';
import PizzaRatingDisplay from '../shared/PizzaRatingDisplay';
import HighlightCards from './HighlightCards';
import StatCard from './StatCard';

type DashboardStats = Prisma.PromiseReturnType<typeof getDashboardStats>;

interface OverviewPanelProps {
	stats: DashboardStats;
	onFocusPlace: (tab: DashboardTab, placeId: string) => void;
}

export default function OverviewPanel({
	stats,
	onFocusPlace,
}: OverviewPanelProps) {
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
				onTopRatedClick={() =>
					stats.topRated && onFocusPlace('my-places', stats.topRated.placeId)
				}
				onMostPopularClick={() =>
					stats.mostPopularPlace &&
					onFocusPlace('all-places', stats.mostPopularPlace.placeId)
				}
			/>

			<Link href="/dashboard/new" className="submit-cta">
				<FontAwesomeIcon icon="plus" className="submit-cta__icon" />
				<span className="submit-cta__label">Rate a Pizza</span>
				<span className="submit-cta__sub">
					Slice or whole pie. Homemade or from a joint.
				</span>
			</Link>
		</div>
	);
}
