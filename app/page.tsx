import '@/styles/pages/index.scss';

import HomePage from '@/app/home-page';

const getData = async () => {
	// get SSR data here
};

export default async function Home() {
	await getData();
	return <HomePage />;
}
