export interface IPeriod {
	number: number;
	name: string;
	startTime: string;
	endTime: string;
	icon: string;
	temperature: number;
	temperatureUnit: string;
	temperatureTrend: string | null;
	windSpeed: string;
	windDirection: string;
	shortForecast: string;
	detailedForecast: string;
	probabilityOfPrecipitation?: {
		value: number;
	};
}

export interface IWeatherData {
	properties: {
		periods: IPeriod[];
	};
}
