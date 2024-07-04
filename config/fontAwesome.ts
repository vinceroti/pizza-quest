import '@fortawesome/fontawesome-svg-core/styles.css';

import { config, library } from '@fortawesome/fontawesome-svg-core';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import {
	faCircleNotch,
	faImage,
	faPizzaSlice,
	faTimes,
	faUser,
	faUserCircle,
	faXmark,
} from '@fortawesome/free-solid-svg-icons';

config.autoAddCss = false;

library.add(
	faUser,
	faCircleCheck,
	faUserCircle,
	faXmark,
	faImage,
	faTimes,
	faPizzaSlice,
	faCircleNotch,
);
