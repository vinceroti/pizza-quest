'use client';

import { setCookie } from 'cookies-next';
import { useMemo, useState } from 'react';

import BestDay from '@/components/BestDay';
import ListMountains from '@/components/ListMountains';
import Regions from '@/components/Regions';
import Resorts from '@/components/Resorts';
import { Mountain, States } from '@/config/enums/Mountains';
import { StorageKeys } from '@/config/enums/storageKeys';
import { MountainUrls } from '@/config/settings';
import type { IWeatherData } from '@/interfaces/IWeather';

const getMountainData = (state: States) => {
	return Promise.all(
		MountainUrls[state].map(async ({ name, url }) => {
			const response = await fetch(url);
			const weatherData: IWeatherData = await response.json();
			return { name, weatherData, state };
		}),
	);
};

export default function HomePage({
	savedRegion,
	savedResorts,
	ssrData,
}: {
	savedRegion: States;
	savedResorts: Mountain[];
	ssrData: Array<{ name: Mountain; weatherData: IWeatherData; state: States }>;
}) {
	// global state store will solve this (but learning the old fansioned way for now)
	const [region, setRegion] = useState<States>(savedRegion);
	const [resorts, setResorts] = useState<Mountain[]>(savedResorts);
	const [data, setData] = useState(ssrData);
	const [isLoading, setIsLoading] = useState(false);

	const filteredData = useMemo(() => {
		if (region.length === 0) return null;
		return data.filter(
			({ state, name }: { state: States; name: Mountain }) =>
				region.includes(state) && resorts.includes(name),
		);
	}, [data, region, resorts]);

	const onRegionChange = (region: States) => {
		const fetchData = async () => {
			setIsLoading(true);
			const newData = await getMountainData(region);
			setData(newData);
			setIsLoading(false);
		};
		setRegion(region);
		fetchData();
		onResortsChange(
			Object.values(MountainUrls[region]).map(({ name }) => name),
		);
		setCookie(StorageKeys.Region, region);
	};

	const onResortsChange = (resorts: Mountain[]) => {
		setResorts(resorts);
		setCookie(StorageKeys.Resorts, resorts);
	};

	return (
		<div className="max-w-lg scrim w-full">
			<div className="mt-4 mb-2 flex gap-2 items-start">
				<Regions region={region} onRegionChange={onRegionChange} />
				<Resorts
					region={region}
					resorts={resorts}
					onResortsChange={onResortsChange}
				/>
			</div>
			<div className="mb-4">
				<ListMountains data={filteredData} isLoading={isLoading} />
			</div>
			<div className="mb-4">
				<BestDay data={filteredData} />
			</div>
		</div>
	);
}
