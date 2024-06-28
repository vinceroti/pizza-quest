import '@fortawesome/fontawesome-svg-core/styles.css';

import { config, library } from '@fortawesome/fontawesome-svg-core';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import {
	faCircleNotch,
	faImage,
	faPizzaSlice,
	faUser,
	faXmark,
} from '@fortawesome/free-solid-svg-icons';

config.autoAddCss = false;

library.add(
	faUser,
	faCircleCheck,
	faXmark,
	faImage,
	faPizzaSlice,
	faCircleNotch,
);
