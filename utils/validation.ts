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

export { emailValidation, passwordValidation };
