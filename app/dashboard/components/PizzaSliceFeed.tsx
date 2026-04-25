'use client';

import '@/styles/pages/dashboard.scss';

import { Prisma } from '@prisma/client';
import { useCallback, useEffect, useState } from 'react';

import { getAllPizzaSliceData } from '@/app/actions';

import EmptyState from './EmptyState';
import FilterTabs from './FilterTabs';
import LoadingSpinner from './LoadingSpinner';
import PizzaSliceCard from './PizzaSliceCard';
import SearchBox from './SearchBox';

export type PizzaSliceFeedData = Prisma.PromiseReturnType<
	typeof getAllPizzaSliceData
>;

interface PizzaSliceFeedProps {
	userId?: number;
	initialData: PizzaSliceFeedData;
}

export default function PizzaSliceFeed({
	userId,
	initialData,
}: PizzaSliceFeedProps) {
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [feed, setFeed] = useState<PizzaSliceFeedData>(initialData);
	const [filter, setFilter] = useState<'all' | 'self'>('all');
	const [searchQuery, setSearchQuery] = useState<string>('');

	const getFeed = useCallback(async () => {
		try {
			setLoading(true);
			const sliceResponse =
				filter === 'all'
					? await getAllPizzaSliceData()
					: await getAllPizzaSliceData(userId);
			setFeed(sliceResponse);
		} catch (error: unknown) {
			setErrorMessage((error as Error).message);
		} finally {
			setLoading(false);
		}
	}, [filter, userId]);

	useEffect(() => {
		if (filter === 'all' && feed === initialData) return;
		getFeed();
	}, [getFeed]); // eslint-disable-line react-hooks/exhaustive-deps

	const filteredFeed = feed.filter((slice) => {
		if (!searchQuery.trim()) return true;
		const query = searchQuery.toLowerCase();
		return (
			slice.pizzaPlace.mainText.toLowerCase().includes(query) ||
			slice.user.username.toLowerCase().includes(query) ||
			slice.notes?.toLowerCase().includes(query)
		);
	});

	return (
		<div className="mt-4 space-y-4 pizza-feed">
			<div className="flex flex-col items-center gap-4 mb-4">
				<FilterTabs activeFilter={filter} onFilterChange={setFilter} />
			</div>
			<SearchBox value={searchQuery} onChange={setSearchQuery} />
			<div className="pizza-feed__list">
				{loading ? (
					<LoadingSpinner />
				) : errorMessage ? (
					<div className="text-center">{errorMessage}</div>
				) : (
					<div>
						{filteredFeed.length === 0 && (
							<EmptyState
								title={searchQuery ? 'No matches' : 'No slices yet'}
								message={
									searchQuery
										? 'Try a different search term.'
										: 'The timeline will fill up as people rate pizza!'
								}
							/>
						)}
						<div className="mt-10 flex flex-col justify-center items-center">
							{filteredFeed.map((slice) => (
								<PizzaSliceCard key={slice.id} slice={slice} />
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
