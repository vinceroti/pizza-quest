'use client';

import { Prisma } from '@prisma/client';
import { useCallback, useEffect, useState } from 'react';

import { getAllPizzaSliceData } from '@/app/actions';

import FilterTabs from './FilterTabs';
import LoadingSpinner from './LoadingSpinner';
import PizzaSliceCard from './PizzaSliceCard';
import SearchBox from './SearchBox';

export default function PizzaSliceFeed({ userId }: { userId?: number }) {
	const [loading, setLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState('');
	const [feed, setFeed] = useState<
		Prisma.PromiseReturnType<typeof getAllPizzaSliceData>
	>([]);
	const [filter, setFilter] = useState<'all' | 'self'>('all');
	const [searchQuery, setSearchQuery] = useState<string>('');

	const getFeed = useCallback(async () => {
		try {
			setLoading(true);
			let sliceResponse:
				| Prisma.PromiseReturnType<typeof getAllPizzaSliceData>
				| undefined;

			if (filter === 'all') {
				sliceResponse = await getAllPizzaSliceData();
			} else {
				sliceResponse = await getAllPizzaSliceData(userId);
			}

			setFeed(sliceResponse);
		} catch (error: unknown) {
			setErrorMessage((error as Error).message);
		} finally {
			setLoading(false);
		}
	}, [filter, userId]);

	useEffect(() => {
		getFeed();
	}, [getFeed]);

	// Filter feed based on search query
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
		<div
			className="mt-4 space-y-4"
			style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}
		>
			<div className="flex flex-col items-center gap-4 mb-4">
				<FilterTabs activeFilter={filter} onFilterChange={setFilter} />
			</div>
			<SearchBox value={searchQuery} onChange={setSearchQuery} />
			<div style={{ minHeight: '400px' }}>
				{loading ? (
					<LoadingSpinner />
				) : errorMessage ? (
					<div className="text-center">{errorMessage}</div>
				) : (
					<div>
						{filteredFeed.length === 0 && (
							<div className="text-center mt-10">No pizza slices to show.</div>
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
