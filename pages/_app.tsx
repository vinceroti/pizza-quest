import '@/config/fontAwesome';
import '@/styles/index.scss';
import '@/styles/pages/app.scss';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { AppCacheProvider } from '@mui/material-nextjs/v14-pagesRouter';
import { AppProps } from 'next/app';
import Head from 'next/head';
import * as React from 'react';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import SnowfallComponent from '@/components/Snowfall';
import theme from '~/theme';

export default function MyApp(props: AppProps) {
	const { Component, pageProps } = props;
	return (
		<AppCacheProvider {...props}>
			<Head>
				<meta name="viewport" content="initial-scale=1, width=device-width" />
			</Head>
			<div className="app">
				<Header />
				<ThemeProvider theme={theme}>
					<main className="flex grow flex-col items-center justify-between p-4">
						<CssBaseline />
						<Component {...pageProps} />
					</main>
				</ThemeProvider>
				<Footer />
				<SnowfallComponent />
			</div>
		</AppCacheProvider>
	);
}
