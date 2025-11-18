import '@fortawesome/fontawesome-svg-core/styles.css';

import { config, library } from '@fortawesome/fontawesome-svg-core';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import {
	faBars,
	faChevronDown,
	faChevronRight,
	faChevronUp,
	faCircleNotch,
	faClock,
	faCog,
	faHome,
	faImage,
	faMinus,
	faPizzaSlice,
	faPlus,
	faRightFromBracket,
	faSearch,
	faStar,
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
	faStar,
	faPizzaSlice,
	faCircleNotch,
	faChevronDown,
	faChevronRight,
	faChevronUp,
	faSearch,
	faHome,
	faClock,
	faPlus,
	faMinus,
	faCog,
	faRightFromBracket,
	faBars,
);
