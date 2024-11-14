export default interface GooglePrediction {
	description: string;
	place_id: string;
	structured_formatting: {
		main_text: string;
		secondary_text: string;
	};
	types?: string[];
}
