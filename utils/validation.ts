import { PizzaSlice } from '@/interfaces/models/PizzaSlice';

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

function pizzaValidation(data: PizzaSlice): boolean {
	let isValid = true;

	if (data.overall < 1 || data.overall > 5) {
		isValid = false;
	}

	if (data.crustDough < 1 || data.crustDough > 5) {
		isValid = false;
	}

	if (data.sauce < 1 || data.sauce > 5) {
		isValid = false;
	}

	if (data.toppingToPizzaRatio < 1 || data.toppingToPizzaRatio > 5) {
		isValid = false;
	}

	if (data.creativity < 1 || data.creativity > 5) {
		isValid = false;
	}

	if (data.authenticity < 1 || data.authenticity > 5) {
		isValid = false;
	}

	if (data.pizzaPlace.length < 1) {
		isValid = false;
	}

	if (data.userId < -1) {
		isValid = false;
	}

	if (!data.image?.type || !data.image?.data) {
		isValid = false;
	}

	return isValid;
}

export { emailValidation, passwordValidation, pizzaValidation };
