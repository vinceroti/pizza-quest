'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LoadingButton } from '@mui/lab';
import { Alert, Box, TextField } from '@mui/material';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import { emailValidation, usernameValidation } from '@/utils/validation';
import { avatarUpload, userSettingsChange } from '~/actions';

import ImageFileUpload from '../components/ImageFileUpload';

export default function Settings() {
	const { data: session, update } = useSession();
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [emailError, setEmailError] = useState('');
	const [usernameError, setUsernameError] = useState('');
	const [avatar, setAvatar] = useState<File | null>(null);
	const [avatarLoading, setAvatarLoading] = useState(false);

	useEffect(() => {
		if (session?.user) {
			setEmail(session.user.email || '');
			setUsername(session.user.username || '');
		}
	}, [session]);

	const toBase64 = (file: File) =>
		new Promise<string | ArrayBuffer | null>((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const files = event.target.files;
		if (files && files.length > 0) {
			const file = files[0];
			setAvatar(file);
		}
	};

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
			await update({
				email,
				username,
			});

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
		setError(null);
		setSuccess(null);

		try {
			const userId = session?.user?.id;
			if (!avatar) throw new Error('Avatar is missing');
			if (!userId) throw new Error('User ID is missing');

			const avatarBase64 = await toBase64(avatar);

			if (typeof avatarBase64 !== 'string') {
				throw new Error('Error converting avatar to base64');
			}

			const avatarResponse = await avatarUpload({
				userId,
				image: { type: avatar.type, data: avatarBase64 },
			});

			if (avatarResponse?.error) {
				setError(avatarResponse?.error);
			} else {
				setSuccess('Avatar uploaded successfully');
				await update();
			}
		} catch (error) {
			setError(error.message);
		} finally {
			setAvatarLoading(false);
			setAvatar(null);
		}
	};

	return (
		<div>
			<h3 className="mb-6 w-full">User Settings</h3>
			<Box className="p-4 max-w-xxl flex space-x-4 items-stretch">
				<Box className="w-1/4 mr-5">
					<form
						className="h-full flex flex-col justify-between items-center"
						onSubmit={handleAvatarSubmit}
					>
						{!session?.user?.image && !avatar && (
							<FontAwesomeIcon icon="user-circle" className="h-28 w-28" />
						)}
						{session?.user?.image && !avatar && (
							<Image
								src={session.user.image}
								alt="Avatar"
								width={112}
								height={112}
								className="rounded-full h-28 w-28 object-cover"
							/>
						)}

						<ImageFileUpload
							file={avatar}
							setFile={setAvatar}
							alt="Avatar"
							onlyCornerButton
							imageClassName="h-28 w-28 object-cover"
							handleFileChange={handleFileChange}
						/>
						{avatar && (
							<LoadingButton
								loading={avatarLoading}
								fullWidth
								variant="contained"
								type="submit"
							>
								Upload Avatar
							</LoadingButton>
						)}
					</form>
				</Box>
				<Box className="w-1/2">
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
					</form>
				</Box>
			</Box>
			{error && (
				<Alert severity="error" variant="filled" onClose={() => setError(null)}>
					{error}
				</Alert>
			)}
			{success && <Alert severity="success">{success}</Alert>}
		</div>
	);
}
