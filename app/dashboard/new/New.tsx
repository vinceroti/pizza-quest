'use client';

import {
	Button,
	FormControl,
	FormGroup,
	FormLabel,
	Grid,
	TextField,
} from '@mui/material';
import { useState } from 'react';

export default function Dashboard() {
	const [pizzaPlace, setPizzaPlace] = useState('');
	const [overall, setOverall] = useState('');
	const [crustDough, setCrustDough] = useState('');
	const [sauce, setSauce] = useState('');
	const [toppingToPizzaRatio, setToppingToPizzaRatio] = useState('');
	const [creativity, setCreativity] = useState('');
	const [authenticity, setAuthenticity] = useState('');
	const [notes, setNotes] = useState('');

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		// handle form submission here
	};
	return (
		<div>
			<h4>Upload and Rate Pizza Slices</h4>
			<FormControl
				component="form"
				onSubmit={handleSubmit}
				sx={{ width: '100%' }}
			>
				<FormGroup>
					<FormLabel component="legend">Rate your Pizza Slice</FormLabel>
					<Grid container spacing={2}>
						<Grid item xs={6}>
							<TextField
								label="Pizza Place"
								value={pizzaPlace}
								onChange={(e) => setPizzaPlace(e.target.value)}
								fullWidth
								margin="normal"
							/>
							<TextField
								label="Overall"
								value={overall}
								onChange={(e) => setOverall(e.target.value)}
								type="number"
								InputProps={{ inputProps: { min: 0, max: 5 } }}
								fullWidth
								margin="normal"
							/>
							<TextField
								label="Crust/Dough"
								value={crustDough}
								onChange={(e) => setCrustDough(e.target.value)}
								type="number"
								InputProps={{ inputProps: { min: 0, max: 5 } }}
								fullWidth
								margin="normal"
							/>
						</Grid>
						<Grid item xs={6}>
							<TextField
								label="Sauce"
								value={sauce}
								onChange={(e) => setSauce(e.target.value)}
								type="number"
								InputProps={{ inputProps: { min: 0, max: 5 } }}
								fullWidth
								margin="normal"
							/>
							<TextField
								label="Topping to Pizza Ratio"
								value={toppingToPizzaRatio}
								onChange={(e) => setToppingToPizzaRatio(e.target.value)}
								type="number"
								InputProps={{ inputProps: { min: 0, max: 5 } }}
								fullWidth
								margin="normal"
							/>
							<TextField
								label="Creativity"
								value={creativity}
								onChange={(e) => setCreativity(e.target.value)}
								type="number"
								InputProps={{ inputProps: { min: 0, max: 5 } }}
								fullWidth
								margin="normal"
							/>
							<TextField
								label="Authenticity"
								value={authenticity}
								onChange={(e) => setAuthenticity(e.target.value)}
								type="number"
								InputProps={{ inputProps: { min: 0, max: 5 } }}
								fullWidth
								margin="normal"
							/>
						</Grid>
						<Grid item xs={12}>
							<input
								accept="image/*"
								id="contained-button-file"
								type="file"
								style={{ display: 'none' }}
							/>
							<label htmlFor="contained-button-file">
								<Button variant="contained" component="span">
									Upload Pizza Slice Image
								</Button>
							</label>
						</Grid>
						<Grid item xs={12}>
							<TextField
								label="Notes"
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								multiline
								margin="normal"
								fullWidth
								rows={2}
							/>
						</Grid>
					</Grid>
				</FormGroup>
				<Button type="submit" variant="contained" color="primary">
					Submit
				</Button>
			</FormControl>
		</div>
	);
}
