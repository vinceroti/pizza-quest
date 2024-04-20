import { IWeatherData } from '@/interfaces/IWeather';

export async function bestDayToSki(
	weatherData: Array<{ name: string; weatherData: IWeatherData }>,
	apiKey: string = '',
): Promise<string> {
	// compile weather data, get detailed forecast only
	const data = weatherData.map(({ name, weatherData }) => {
		if (!weatherData.properties?.periods) {
			return { name, detailedForecast: 'No weather data available' };
		}
		const periods = weatherData.properties.periods;
		const detailedForecast = periods
			.map((forecast) => forecast.detailedForecast)
			.join(' ');
		return { name, detailedForecast };
	});

	try {
		const res = await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`,
			},
			body: JSON.stringify({
				model: 'gpt-3.5-turbo',
				messages: [
					{
						role: 'system',
						content: `You are a helpful assistant,
						skilled in determining the best day to ski based on weather data.
					 	Respond only with HTML and keep the answers short.
						Give a good reason why it's the best day to ski.
						Add emojis to make it more engaging.`,
					},
					{
						role: 'user',
						content: `Using this weather data, determine the best day to ski. ${JSON.stringify(data)}`,
					},
				],
			}),
		});
		const chatGptResponse = await res.json();
		if (chatGptResponse.error) {
			throw chatGptResponse.error;
		}
		const text = chatGptResponse.choices[0].message.content;
		const html = text.replace(/```html/g, '').replace(/```/g, '');
		return html;
	} catch (err) {
		throw err;
	}
}
