import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import React from 'react';

const Login = () => (
	<Container maxWidth="xs">
		<Box
			sx={{
				marginTop: 8,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>
			<h3>Welcome!</h3>
			<p>Login to your journey for the greatest pizza slice.</p>
			<Box component="form" noValidate sx={{ mt: 1 }}>
				<TextField
					variant="outlined"
					margin="normal"
					required
					fullWidth
					id="username"
					label="Username"
					name="username"
					autoComplete="username"
					autoFocus
				/>
				<TextField
					variant="outlined"
					margin="normal"
					required
					fullWidth
					name="password"
					label="Password"
					type="password"
					id="password"
					autoComplete="current-password"
				/>
				<Button
					type="submit"
					fullWidth
					variant="contained"
					sx={{ mt: 3, mb: 2 }}
				>
					Login
				</Button>
				<Typography variant="body2" align="center" sx={{ mt: 2 }}>
					Don't have an account?
					<Link href="/signup" className="ml-2">
						Sign Up
					</Link>
				</Typography>
			</Box>
		</Box>
	</Container>
);

export default Login;
