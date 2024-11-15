function passwordValidation(password: string, confirmPassword: string) {
	let isValid = true;
	let passwordErrorMsg = '';
	let confirmPasswordErrorMsg = '';

	if (password.length < 5) {
		passwordErrorMsg = 'be at least 5 characters long';
	}

	if (!/[A-Z]/.test(password)) {
		passwordErrorMsg +=
			(passwordErrorMsg ? ', ' : '') + 'contain at least one uppercase letter';
	}

	if (!/[a-z]/.test(password)) {
		passwordErrorMsg +=
			(passwordErrorMsg ? ', ' : '') + 'contain at least one lowercase letter';
	}

	if (!/[0-9]/.test(password)) {
		passwordErrorMsg +=
			(passwordErrorMsg ? ', ' : '') + 'contain at least one digit';
	}

	if (!/[^A-Za-z0-9]/.test(password)) {
		passwordErrorMsg +=
			(passwordErrorMsg ? ', ' : '') + 'contain at least one special character';
	}

	if (password !== confirmPassword) {
		confirmPasswordErrorMsg = 'Passwords do not match';
	}

	if (passwordErrorMsg || confirmPasswordErrorMsg) {
		isValid = false;
	}

	return {
		isValid,
		passwordErrorMsg: passwordErrorMsg
			? 'Password must ' + passwordErrorMsg
			: '',
		confirmPasswordErrorMsg,
	};
}

function emailValidation(email: string) {
	let isValid = true;
	let emailErrorMsg = '';

	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		emailErrorMsg = 'Invalid email address';
		isValid = false;
	}

	return {
		isValid,
		emailErrorMsg,
	};
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function pizzaValidation(data: { [key: string]: any }) {
	if (data.userId < -1) {
		return 'User ID is required.';
		// this should never happen
	}

	if (data.overall < 1 || data.overall > 5) {
		return 'Overall rating must be between 1 and 5 slices.';
	}

	if (data.crustDough < 1 || data.crustDough > 5) {
		return 'Crust/Dough rating must be between 1 and 5 slices.';
	}

	if (data.sauce < 1 || data.sauce > 5) {
		return 'Sauce rating must be between 1 and 5 slices.';
	}

	if (data.toppingToPizzaRatio < 1 || data.toppingToPizzaRatio > 5) {
		return 'Topping to Pizza Ratio rating must be between 1 and 5 slices.';
	}

	if (data.creativity < 1 || data.creativity > 5) {
		return 'Creativity rating must be between 1 and 5 slices.';
	}

	if (data.authenticity < 1 || data.authenticity > 5) {
		return 'Authenticity rating must be between 1 and 5 slices.';
	}

	if (data.pizzaPlace.length < 1) {
		return 'Pizza place name is required.';
	}

	if (!data.image?.type || !data.image?.data) {
		return 'Image is required.';
	}

	return '';
}

function usernameValidation(username: string) {
	let isValid = true;
	let usernameErrorMsg = '';

	if (username.length < 3 || username.length > 20) {
		usernameErrorMsg = 'Username must be between 3 and 20 characters long';
		isValid = false;
	}

	if (!/^[a-zA-Z0-9_]+$/.test(username)) {
		usernameErrorMsg =
			'Username can only contain alphanumeric characters and underscores';
		isValid = false;
	}

	return {
		isValid,
		usernameErrorMsg,
	};
}

export {
	emailValidation,
	passwordValidation,
	pizzaValidation,
	usernameValidation,
};
