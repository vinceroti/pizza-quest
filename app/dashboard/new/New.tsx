'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LoadingButton from '@mui/lab/LoadingButton';
import {
	Alert,
	Box,
	Button,
	FormControl,
	FormGroup,
	Grid,
	Rating,
	TextField,
	Typography,
} from '@mui/material';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

import { submitSlice } from '@/app/actions';
import { GooglePrediction } from '@/interfaces/models/GooglePrediction';
import { pizzaValidation } from '@/utils/validation';

import PizzaPlaceAutoComplete from '../components/PizzaPlaceAutoComplete';

export default function Dashboard() {
	const { data: session } = useSession();

	const [pizzaPlace, setPizzaPlace] = useState<Prediction | null>(null);
	const [overall, setOverall] = useState(2.5);
	const [crustDough, setCrustDough] = useState(2.5);
	const [sauce, setSauce] = useState(2.5);
	const [toppingToPizzaRatio, setToppingToPizzaRatio] = useState(2.5);
	const [creativity, setCreativity] = useState(2.5);
	const [authenticity, setAuthenticity] = useState(2.5);
	const [notes, setNotes] = useState('');
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [file, setFile] = useState<File | null>(null);
	const [success, setSuccess] = useState(false);

	const PizzaIcon = () => (
		<FontAwesomeIcon icon="pizza-slice" className="m-0.5" />
	);

	const toBase64 = (file: File) =>
		new Promise<string | ArrayBuffer | null>((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setErrorMessage('');

		const fileBase64 = file ? await toBase64(file) : null;

		const data = {
			pizzaPlace,
			overall,
			crustDough,
			sauce,
			toppingToPizzaRatio,
			creativity,
			authenticity,
			notes,
			image: { type: file?.type, data: fileBase64 },
			userId: session?.user?.id,
		};

		const isValid = pizzaValidation(data);

		if (!isValid) {
			setErrorMessage('Invalid pizza slice data');
			return;
		}

		setLoading(true);

		try {
			const sliceResponse = await submitSlice(data);
			if (sliceResponse?.error) {
				setErrorMessage(sliceResponse.error);
				return;
			}
			setSuccess(true);
		} catch (error) {
			setErrorMessage(error.message);
		} finally {
			setLoading(false);
		}
	};

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			setFile(file);
		}
	};

	const handlePizzaPlaceChange = (value: GooglePrediction) => {
		setPizzaPlace(value);
		console.log(value);
	};

	return (
		<div>
			<h4 className="mb-3">Upload and Rate Pizza Slices</h4>
			{success ? (
				<div className="mt-20">
					<h4>Success!</h4>
					<FontAwesomeIcon
						icon={{ prefix: 'far', iconName: 'circle-check' }}
						className="light-green mb-5 mt-3"
						size="4x"
					/>
					<p>Your pizza slice rating has been submitted successfully.</p>
				</div>
			) : (
				<FormControl
					component="form"
					onSubmit={handleSubmit}
					sx={{ width: '100%' }}
				>
					<FormGroup>
						<PizzaPlaceAutoComplete
							handleInputChange={handlePizzaPlaceChange}
						/>
						<Grid container spacing={2}>
							<Grid item xs={6}>
								<Box mb={2} mt={2}>
									<Typography component="legend">Overall Rating</Typography>
									<Rating
										name="overall-rating"
										value={overall}
										precision={0.5}
										onChange={(event, newValue) => {
											setOverall(newValue);
										}}
										icon={<PizzaIcon />}
										emptyIcon={<PizzaIcon style={{ opacity: 0.55 }} />}
									/>
								</Box>
								<Box mb={2} mt={2}>
									<Typography component="legend">Crust/Dough Rating</Typography>
									<Rating
										name="crust-dough-rating"
										value={crustDough}
										precision={0.5}
										onChange={(event, newValue) => {
											setCrustDough(newValue);
										}}
										icon={<PizzaIcon />}
										emptyIcon={<PizzaIcon style={{ opacity: 0.55 }} />}
									/>
								</Box>
								<Box mb={2} mt={2}>
									<Typography component="legend">Authenticity</Typography>
									<Rating
										name="authenticity"
										value={authenticity}
										precision={0.5}
										onChange={(event, newValue) => {
											setAuthenticity(newValue);
										}}
										icon={<PizzaIcon />}
										emptyIcon={<PizzaIcon style={{ opacity: 0.55 }} />}
									/>
								</Box>
							</Grid>
							<Grid item xs={6}>
								<Box mb={2} mt={2}>
									<Typography component="legend">Sauce Rating</Typography>
									<Rating
										name="sauce-rating"
										value={sauce}
										precision={0.5}
										onChange={(event, newValue) => {
											setSauce(newValue);
										}}
										icon={<PizzaIcon />}
										emptyIcon={<PizzaIcon style={{ opacity: 0.55 }} />}
									/>
								</Box>
								<Box mb={2} mt={2}>
									<Typography component="legend">
										Topping to Pizza Ratio
									</Typography>
									<Rating
										name="topping-to-pizza-ratio"
										value={toppingToPizzaRatio}
										precision={0.5}
										onChange={(event, newValue) => {
											setToppingToPizzaRatio(newValue);
										}}
										icon={<PizzaIcon />}
										emptyIcon={<PizzaIcon style={{ opacity: 0.55 }} />}
									/>
								</Box>
								<Box mb={2} mt={2}>
									<Typography component="legend">Creativity</Typography>
									<Rating
										name="creativity"
										value={creativity}
										precision={0.5}
										onChange={(event, newValue) => {
											setCreativity(newValue);
										}}
										icon={<PizzaIcon />}
										emptyIcon={<PizzaIcon style={{ opacity: 0.55 }} />}
									/>
								</Box>
							</Grid>
							<Grid item xs={12}>
								<div className="mb-3 flex justify-center">
									<div className="image-upload-container m-auto relative flex">
										{file && (
											<>
												<Image
													src={URL.createObjectURL(file)}
													alt="Pizza Slice"
													width={208}
													height={117}
													className="rounded-lg"
												/>
												<button
													className="delete-image-button absolute top-0 right-0 bg-black bg-opacity-50 button-link p-2.5 rounded-bl-lg rounded-tr-lg flex items-center justify-center hover:bg-opacity-70 ease-in-out transition"
													onClick={() => setFile(null)}
												>
													<FontAwesomeIcon icon="xmark" size="xl" />
												</button>
											</>
										)}
									</div>
								</div>
								<input
									accept="image/*"
									id="contained-button-file"
									type="file"
									className="hidden"
									onChange={handleFileChange}
								/>
								<label htmlFor="contained-button-file">
									<Button variant="contained" component="span">
										<FontAwesomeIcon icon="image" className="mr-1" />
										{file ? file.name : 'Upload Image'}
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
					<LoadingButton
						loading={loading}
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						sx={{
							mt: 3,
							mb: 2,
							maxWidth: 400,
							marginLeft: 'auto',
							marginRight: 'auto',
						}}
					>
						Submit
					</LoadingButton>
					{errorMessage && (
						<Alert
							severity="error"
							variant="filled"
							onClose={() => setErrorMessage('')}
						>
							{errorMessage}
						</Alert>
					)}
				</FormControl>
			)}
		</div>
	);
}
