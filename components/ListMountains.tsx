import { IconName, IconPrefix } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Image from 'next/image';
import { createRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import type { IPeriod, IWeatherData } from '@/interfaces/IWeather';

interface IProps {
	isLoading: boolean;
	data: Array<{
		name: string;
		weatherData: IWeatherData;
	}> | null;
}

const chooseIcon = (item: IPeriod): [IconPrefix, IconName] => {
	if (item.shortForecast.includes('Rain')) {
		return ['fas', 'droplet'];
	}
	if (item.shortForecast.includes('Snow')) {
		return ['fas', 'snowflake'];
	}
	if (item.shortForecast.includes('Sleet')) {
		return ['fas', 'cloud-meatball'];
	}
	if (item.shortForecast.includes('Thunderstorm')) {
		return ['fas', 'bolt'];
	}
	if (item.shortForecast.includes('Sun')) {
		return ['fas', 'sun'];
	}
	if (item.shortForecast.includes('Cloud')) {
		return ['fas', 'cloud'];
	}
	if (item.shortForecast.includes('Clear')) {
		return ['fas', 'moon'];
	}
	return ['fas', 'question'];
};

const extractSnowAccumulation = (forecast: string): string | null => {
	const match = forecast.match(/New snow accumulation of (.+?) possible\./);
	if (match) {
		return match[1].replace(' to ', ' - ').replace(' inches', '');
	}
	return null;
};

const shortForecastSnow = (item: IPeriod) => {
	const snowAccumulation = extractSnowAccumulation(item.detailedForecast);
	return snowAccumulation ? snowAccumulation : item.shortForecast;
};

const weatherDetails = (item: IPeriod) => (
	<div className="flex flex-wrap mb-1">
		<p className="mr-4">
			<FontAwesomeIcon icon={['fas', 'thermometer-half']} /> {item.temperature}
			{item.temperatureUnit}{' '}
			{item.temperatureTrend ? `(${item.temperatureTrend})` : ''}
		</p>
		{item.probabilityOfPrecipitation &&
			item.probabilityOfPrecipitation.value && (
				<p className="mr-4">
					<FontAwesomeIcon icon={chooseIcon(item)} /> Precipitation:{' '}
					{item.probabilityOfPrecipitation.value}%
				</p>
			)}
		<p>
			<FontAwesomeIcon icon={['fas', 'wind']} className="mr-1" />
			{item.windSpeed} from the {item.windDirection}
		</p>
	</div>
);

const snowDetails = (item: IPeriod) => {
	return (
		<div className="ml-1 flex flex-wrap justify-center">
			<span className="mr-4">
				<FontAwesomeIcon icon={['fas', 'thermometer-half']} />{' '}
				{item.temperature}
				{item.temperatureUnit}{' '}
				{item.temperatureTrend ? `(${item.temperatureTrend})` : ''}
			</span>
			<span className="capitalize">
				<FontAwesomeIcon icon={chooseIcon(item)} className="mr-1" />
				{shortForecastSnow(item)}
			</span>
		</div>
	);
};

const getFirstDay = (data: IWeatherData) => {
	if (data.properties?.periods) {
		return snowDetails(data.properties.periods[0]);
	}
	return 'No data available';
};

const renderItem = (item: IPeriod) => (
	<div>
		<div className="flex">
			<Image
				className="w-12 h-12"
				src={item.icon}
				alt="weather icon"
				width={100}
				height={100}
			/>
			<div className="flex flex-col justify-center ml-4">
				<h6>{item.name}</h6>
				<p>
					{new Date(item.startTime).toLocaleTimeString()} -{' '}
					{new Date(item.endTime).toLocaleTimeString()}
				</p>
			</div>
		</div>
		{weatherDetails(item)}
		<p className="mb-0">{item.detailedForecast}</p>
	</div>
);

const mapItems = (data: IWeatherData) => {
	if (data.properties?.periods) {
		return data.properties.periods.map((item) => (
			<ListItem
				key={item.number.toString()}
				sx={{
					borderBottom: '1px solid gray',
					padding: '1rem 0.5rem',
					'&:last-child': { borderBottom: 'none' },
				}}
			>
				{renderItem(item)}
			</ListItem>
		));
	}
	return 'No data available';
};

export default function ListMountains({ isLoading, data }: IProps) {
	const noMountainsRef = createRef<HTMLDivElement>();
	return (
		<div>
			{isLoading && (
				<FontAwesomeIcon
					className="animate-spin w-full mb-5"
					icon={['fas', 'spinner']}
					size="3x"
				/>
			)}

			{!isLoading && data && (
				<TransitionGroup>
					{data.length > 0 &&
						data.map(({ name, weatherData }) => {
							const nodeRef = createRef<HTMLDivElement>();
							return (
								<CSSTransition
									key={name}
									nodeRef={nodeRef}
									timeout={200}
									classNames="fade-height"
								>
									<div ref={nodeRef}>
										<Accordion className="mb-4 w-full">
											<AccordionSummary
												expandIcon={
													<FontAwesomeIcon icon={['fas', 'chevron-down']} />
												}
												id="panel-header"
												aria-controls="panel-content"
											>
												<div className="w-full">
													<strong className="whitespace-nowrap mb-3 block">
														{name}
													</strong>
													{getFirstDay(weatherData)}
												</div>
											</AccordionSummary>
											<AccordionDetails
												sx={{
													borderTop: '1px solid #000',
													background: '#f8f8f8',
												}}
											>
												<List>{mapItems(weatherData)}</List>
											</AccordionDetails>
										</Accordion>
									</div>
								</CSSTransition>
							);
						})}

					{data?.length === 0 && (
						<CSSTransition
							timeout={200}
							classNames="fade-height"
							nodeRef={noMountainsRef}
						>
							<h5 className="mb-10 mt-5" ref={noMountainsRef}>
								No mountains selected.
							</h5>
						</CSSTransition>
					)}
				</TransitionGroup>
			)}
		</div>
	);
}
