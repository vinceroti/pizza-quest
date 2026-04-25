import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'com.pizzaquest.app',
	appName: 'Pizza Quest',
	webDir: 'out',
	server: {
		url: 'http://localhost:3000',
		cleartext: true,
	},
	ios: {
		allowsLinkPreview: false,
		scrollEnabled: true,
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
