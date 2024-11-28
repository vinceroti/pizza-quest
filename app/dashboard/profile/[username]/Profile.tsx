'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { getUserInfo } from '~/actions';

export default function Profile({
	username: defaultUsername,
}: {
	username: string;
}) {
	const [loading, setLoading] = useState(false);
	const [username, setUsername] = useState('');
	const [profileImage, setProfileImage] = useState<string | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	async function fetchUserProfile() {
		try {
			setLoading(true);
			const response = await getUserInfo(defaultUsername);
			if (!response) {
				throw new Error('User not found');
			}
			setUsername(response.username);
			setProfileImage(response.image);
		} catch (error: unknown) {
			setErrorMessage((error as Error).message);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		fetchUserProfile();
	}, [defaultUsername]);

	return (
		<div>
			<Box className="p-4 max-w-xxl flex space-x-4 items-center">
				{loading ? (
					<FontAwesomeIcon
						icon="circle-notch"
						className="animate-spin mt-44 mx-auto"
						size="3x"
					/>
				) : (
					<>
						<Box className="w-1/4 mr-5">
							{!profileImage && (
								<FontAwesomeIcon icon="user-circle" className="h-28 w-28" />
							)}
							{profileImage && (
								<Image
									src={profileImage}
									alt="Avatar"
									width={112}
									height={112}
									className="rounded-full h-28 w-28 object-cover"
								/>
							)}
						</Box>
						<Box className="w-1/2">
							<h4>{username}</h4>
							{errorMessage && (
								<Typography color="error">{errorMessage}</Typography>
							)}
						</Box>
					</>
				)}
			</Box>
		</div>
	);
}
