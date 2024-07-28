'use client';

import { LoadingButton } from '@mui/lab';
import { Alert, Box, TextField } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import { emailValidation, usernameValidation } from '@/utils/validation';
import { userSettingsChange } from '~/actions';

export default function Settings() {
	const { data: session } = useSession();
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [emailError, setEmailError] = useState('');
	const [usernameError, setUsernameError] = useState('');
	const [avatar, setAvatar] = useState<File | null>(null);
	const [avatarLoading, setAvatarLoading] = useState(false);
	const [avatarError, setAvatarError] = useState<string | null>(null);
	const [avatarSuccess, setAvatarSuccess] = useState<string | null>(null);

	useEffect(() => {
		if (session?.user) {
			setEmail(session.user.email || '');
			setUsername(session.user.username || '');
		}
	}, [session]);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoading(true);
		setError(null);
		setSuccess(null);
		setEmailError('');
		setUsernameError('');

		const { isValid: isEmailValid, emailErrorMsg } = emailValidation(email);
		const { isValid: isUsernameValid, usernameErrorMsg } =
			usernameValidation(username);

		if (!isEmailValid || !isUsernameValid) {
			setEmailError(emailErrorMsg);
			setUsernameError(usernameErrorMsg);
			setLoading(false);
			return;
		}

		try {
			const userId = session?.user?.id;
			if (!userId) throw new Error('User ID is missing');

			const settingsChangeResponse = await userSettingsChange({
				userId,
				email,
				username,
			});
			if (settingsChangeResponse?.error) {
				setError(settingsChangeResponse.error);
			}
			setSuccess('Settings updated successfully');
		} catch (error) {
			setError(error.message);
		} finally {
			setLoading(false);
		}
	};

	const handleAvatarSubmit = async (
		event: React.FormEvent<HTMLFormElement>,
	) => {
		event.preventDefault();
		setAvatarLoading(true);
		setAvatarError(null);
		setAvatarSuccess(null);

		try {
			const userId = session?.user?.id;
			if (!userId) throw new Error('User ID is missing');

			const formData = new FormData();
			formData.append('avatar', avatar as Blob);

			const response = await fetch(`/api/users/${userId}/avatar`, {
				method: 'POST',
				body: formData,
			});
			const data = await response.json();
			if (data.error) {
				setAvatarError(data.error);
			}
			setAvatarSuccess('Avatar uploaded successfully');
		} catch (error) {
			setAvatarError(error.message);
		} finally {
			setAvatarLoading(false);
		}
	};

	return (
		<Box className="p-4 max-w-xl flex space-x-4">
			<Box className="w-1/2">
				<h3 className="mb-6">Upload Avatar</h3>
				<form onSubmit={handleAvatarSubmit} className="space-y-4">
					<TextField
						type="file"
						label="Avatar"
						variant="outlined"
						fullWidth
						onChange={(e) => setAvatar(e.target.files[0])}
					/>
					<LoadingButton
						loading={avatarLoading}
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
					>
						Upload Avatar
					</LoadingButton>
					{avatarError && (
						<Alert
							severity="error"
							variant="filled"
							onClose={() => setAvatarError('')}
						>
							{avatarError}
						</Alert>
					)}
					{avatarSuccess && <Alert severity="success">{avatarSuccess}</Alert>}
				</form>
			</Box>
			<Box className="w-1/2">
				<h3 className="mb-6">User Settings</h3>
				<form onSubmit={handleSubmit} className="space-y-4">
					<TextField
						label="Email"
						variant="outlined"
						fullWidth
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						error={!!emailError}
						helperText={emailError}
					/>
					<TextField
						label="Username"
						variant="outlined"
						fullWidth
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						error={!!usernameError}
						helperText={usernameError}
					/>
					<LoadingButton
						loading={loading}
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
					>
						Save Changes
					</LoadingButton>
					{error && (
						<Alert
							severity="error"
							variant="filled"
							onClose={() => setError('')}
						>
							{error}
						</Alert>
					)}
					{success && <Alert severity="success">{success}</Alert>}
				</form>
			</Box>
		</Box>
	);
}
