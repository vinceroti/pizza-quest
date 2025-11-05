'use client';

import '@/config/fontAwesome';

import { createTheme } from '@mui/material/styles';
import { Roboto } from 'next/font/google';
const roboto = Roboto({
	weight: ['300', '400', '500', '700'],
	subsets: ['latin'],
	display: 'swap',
});

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
		fontFamily: roboto.style.fontFamily,
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
