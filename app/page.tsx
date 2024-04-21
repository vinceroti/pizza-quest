import '@/styles/pages/index.scss';

import { getCookie } from 'cookies-next';
import { cookies } from 'next/headers';

import HomePage from '@/app/home-page';
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

const getData = async () => {
	let savedRegion =
		(getCookie(StorageKeys.Region, { cookies }) as States) || initialState;

	const savedResortsString =
		getCookie(StorageKeys.Resorts, { cookies }) || '[]';
	let savedResorts = JSON.parse(savedResortsString);

	if (!savedResorts.length) {
		savedResorts = initialResorts;
		savedRegion = initialState;
	}

	const ssrData = await getMountainData(savedRegion);
	return { ssrData, savedRegion, savedResorts };
};

export default async function Home() {
	const { savedRegion, savedResorts, ssrData } = await getData();

	return (
		<HomePage
			savedRegion={savedRegion}
			savedResorts={savedResorts}
			ssrData={ssrData}
		/>
	);
}
