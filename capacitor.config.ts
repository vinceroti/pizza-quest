import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'com.pizzaquest.app',
	appName: 'Pizza Quest',
	webDir: 'out',
	server: {
		// Replace with your actual Vercel deployment URL
		url: 'https://pizza-quest.vercel.app',
		cleartext: false,
	},
	ios: {
		allowsLinkPreview: false,
		scrollEnabled: false,
	},
	plugins: {
		SplashScreen: {
			launchAutoHide: true,
			autoHideDuration: 2000,
			backgroundColor: '#1e3a5f',
			showSpinner: false,
		},
		StatusBar: {
			style: 'LIGHT',
			backgroundColor: '#1e3a5f',
		},
	},
};

export default config;
