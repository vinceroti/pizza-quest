import '@/styles/index.scss';
import '@/styles/pages/app.scss';

import { ThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import * as React from 'react';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Providers } from '~/providers';
import theme from '~/theme';
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<div className="app">
					<Providers>
						<Header />
						<AppRouterCacheProvider>
							<ThemeProvider theme={theme}>
								<main className="flex grow flex-col items-center justify-between p-4">
									{children}
								</main>
							</ThemeProvider>
						</AppRouterCacheProvider>
						<Footer />
					</Providers>
				</div>
			</body>
		</html>
	);
}
