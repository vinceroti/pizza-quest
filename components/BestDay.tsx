import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import type { IWeatherData } from '@/interfaces/IWeather';

interface IProps {
	name: string;
	weatherData: IWeatherData;
}

export default function BestDay(props: Array<IProps>) {
	const [summary, setSummary] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleClick = async () => {
		if (!summary) {
			setIsLoading(true);
		} else {
			setSummary('');
			setTimeout(() => setIsLoading(true), 200);
			// The delay should be the same as the timeout prop of the CSSTransition
		}

		try {
			const response = await fetch('/api/chatgpt', {
				method: 'POST',
				body: JSON.stringify(props),
			});

			if (!response.ok) {
				throw response;
			}

			const summaryText = await response.json();
			setSummary(summaryText);
		} catch (err) {
			setSummary('An error occurred, please try again later.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div>
			<Button variant="outlined" onClick={handleClick} disabled={isLoading}>
				<FontAwesomeIcon
					icon={isLoading ? ['fas', 'spinner'] : ['fas', 'magic-wand-sparkles']}
					className={`${isLoading ? 'animate-spin' : ''} mr-2`}
				/>
				Calculate The Best Day To Ski
			</Button>

			{isLoading && (
				<FontAwesomeIcon
					icon={isLoading ? ['fas', 'spinner'] : ['fas', 'magic-wand-sparkles']}
					className={`${isLoading ? 'animate-spin w-full' : ''} mt-10`}
					size="3x"
				/>
			)}

			<CSSTransition
				in={!!summary && !isLoading}
				timeout={200}
				classNames="fade"
				unmountOnExit
			>
				<div className="mt-4">
					<h4>Best Day Summary</h4>
					<div dangerouslySetInnerHTML={{ __html: summary }} />
				</div>
			</CSSTransition>
		</div>
	);
}
