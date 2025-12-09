'use client';

import '@/config/fontAwesome';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			main: '#4d90fe',
			light: '#7fb3ff',
			dark: '#2871e0',
		},
		secondary: {
			main: '#ffc107',
			light: '#ffd54f',
			dark: '#ffa000',
		},
		background: {
			default: '#1e3a5f', // Blue-tinted dark background
			paper: 'rgba(30, 58, 95, 0.7)', // Semi-transparent blue
		},
		text: {
			primary: '#ffffff',
			secondary: 'rgba(255, 255, 255, 0.8)',
		},
	},
	typography: {
		fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
	},
	components: {
		MuiPaper: {
			styleOverrides: {
				root: {
					backgroundImage: 'none',
					backgroundColor: 'rgba(30, 58, 95, 0.7)',
					backdropFilter: 'blur(10px)',
					border: '1px solid rgba(77, 144, 254, 0.2)',
				},
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					backgroundImage: 'none',
					backgroundColor: 'rgba(30, 58, 95, 0.8)',
					backdropFilter: 'blur(10px)',
					border: '1px solid rgba(77, 144, 254, 0.2)',
				},
			},
		},
		MuiTableContainer: {
			styleOverrides: {
				root: {
					backgroundColor: 'rgba(30, 58, 95, 0.7)',
					backdropFilter: 'blur(10px)',
				},
			},
		},
		MuiTableCell: {
			styleOverrides: {
				root: {
					borderColor: 'rgba(77, 144, 254, 0.2)',
				},
				head: {
					fontWeight: 700,
					backgroundColor: 'rgba(45, 75, 115, 0.9)',
				},
			},
		},
		MuiTextField: {
			styleOverrides: {
				root: {
					'& .MuiOutlinedInput-root': {
						backgroundColor: 'rgba(0, 0, 0, 0.3)',
						'& input': {
							color: '#ffffff',
						},
						'& fieldset': {
							borderColor: 'rgba(77, 144, 254, 0.3)',
						},
						'&:hover fieldset': {
							borderColor: 'rgba(77, 144, 254, 0.5)',
						},
						'&.Mui-focused fieldset': {
							borderColor: '#4d90fe',
						},
					},
					'& .MuiInputLabel-root': {
						color: 'rgba(255, 255, 255, 0.7)',
					},
					'& .MuiInputLabel-root.Mui-focused': {
						color: '#ffc107',
					},
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				contained: {
					backgroundColor: '#4d90fe',
					'&:hover': {
						backgroundColor: '#2871e0',
					},
				},
			},
		},
	},
});

export default theme;
