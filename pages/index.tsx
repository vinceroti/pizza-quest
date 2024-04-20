import '@/styles/pages/index.scss';

import { getCookie, setCookie } from 'cookies-next';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useMemo, useState } from 'react';

import BestDay from '@/components/BestDay';
import ListMountains from '@/components/ListMountains';
import Regions from '@/components/Regions';
import Resorts from '@/components/Resorts';
import { Mountain, States } from '@/config/enums/Mountains';
import { StorageKeys } from '@/config/enums/storageKeys';
import { MountainUrls } from '@/config/settings';
import type { IWeatherData } from '@/interfaces/IWeather';

const initialState = States.Washington;
const initialResorts: Mountain[] = Object.values(
	MountainUrls[initialState],
).map(({ name }) => name);

const getMountainData = (state: States) => {
	return Promise.all(
		MountainUrls[state].map(async ({ name, url }) => {
			const response = await fetch(url);
			const weatherData: IWeatherData = await response.json();
			return { name, weatherData, state };
		}),
	);
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
	let savedRegion =
		(getCookie(StorageKeys.Region, { req, res }) as States) || initialState;

	let savedResorts: Mountain[] | string =
		getCookie(StorageKeys.Resorts, { req, res }) || '[]';
	savedResorts = JSON.parse(savedResorts);

	if (!savedResorts.length) {
		savedResorts = initialResorts;
		savedRegion = initialState;
	}

	const ssrData = await getMountainData(savedRegion);
	return { props: { ssrData, savedRegion, savedResorts } };
};

export default function Home({
	savedRegion,
	savedResorts,
	ssrData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
				{Regions({ onRegionChange, region })}
				{Resorts({ onResortsChange, resorts, region })}
			</div>
			<div className="mb-4">
				{ListMountains({ data: filteredData, isLoading })}
			</div>
			<div className="mb-4">{BestDay(filteredData)}</div>
		</div>
	);
}
