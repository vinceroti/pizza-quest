import '@/styles/index.scss';
import '@/styles/pages/app.scss';

import { ThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import NextTopLoader from 'nextjs-toploader';
import * as React from 'react';

import Footer from '@/components/Footer';
import SpaceBackground from '@/components/SpaceBackground';
import { roboto } from '~/fonts';
import { Providers } from '~/providers';
import theme from '~/theme';

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={roboto.className}>
				<SpaceBackground />
				<div className="app">
					<Providers>
						<AppRouterCacheProvider>
							<NextTopLoader color="#ffc107" showSpinner={false} />
							<ThemeProvider theme={theme}>{children}</ThemeProvider>
						</AppRouterCacheProvider>
						<Footer />
					</Providers>
				</div>
			</body>
		</html>
	);
}
