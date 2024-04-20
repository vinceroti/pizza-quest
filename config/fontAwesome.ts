import '@fortawesome/fontawesome-svg-core/styles.css';

import { config, library } from '@fortawesome/fontawesome-svg-core';
import { far, faSnowflake } from '@fortawesome/free-regular-svg-icons';
import {
	faChevronCircleDown,
	faCloud,
	faCloudMeatball,
	faDroplet,
	faMagicWandSparkles,
	fas,
	faSpinner,
	faSun,
	faThermometerHalf,
	faThunderstorm,
	faWind,
} from '@fortawesome/free-solid-svg-icons';

config.autoAddCss = false;

library.add(
	faSnowflake,
	faSun,
	faCloud,
	faThunderstorm,
	faCloudMeatball,
	far,
	fas,
	faThermometerHalf,
	faDroplet,
	faSpinner,
	faMagicWandSparkles,
	faWind,
	faChevronCircleDown,
);
