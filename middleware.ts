import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { bestDayToSki } from '@/utils/ChatGPT';
export async function middleware(request: NextRequest) {
	const url = new URL(request.url);

	if (url.pathname.startsWith('/api/chatgpt')) {
		try {
			const apiKey = process.env.CHAT_GPT;
			const weatherData = await request.json();
			const data = await bestDayToSki(weatherData, apiKey);
			return new NextResponse(JSON.stringify(data));
		} catch (error) {
			return new NextResponse(JSON.stringify(error), {
				status: 400,
			});
		}
	}
	return request;
}

export const config = {
	matcher: '/api/chatgpt/:path*',
};
