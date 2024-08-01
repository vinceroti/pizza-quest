'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LoadingButton from '@mui/lab/LoadingButton';
import {
	Alert,
	Box,
	FormControl,
	FormGroup,
	Grid,
	Rating,
	TextField,
	Typography,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

import { submitSlice } from '@/app/actions';
import { GooglePrediction } from '@/interfaces/models/GooglePrediction';
import { pizzaValidation } from '@/utils/validation';

import ImageFileUpload from '../components/ImageFileUpload';
import PizzaPlaceAutoComplete from '../components/PizzaPlaceAutoComplete';

export default function Dashboard() {
	const { data: session } = useSession();

	const [pizzaPlace, setPizzaPlace] = useState<Prediction | null>(null);
	const [overall, setOverall] = useState(0);
	const [crustDough, setCrustDough] = useState(0);
	const [sauce, setSauce] = useState(0);
	const [toppingToPizzaRatio, setToppingToPizzaRatio] = useState(0);
	const [creativity, setCreativity] = useState(0);
	const [authenticity, setAuthenticity] = useState(0);
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

		const errorMsg = pizzaValidation(data);

		if (errorMsg) {
			setErrorMessage(errorMsg);
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

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files && files.length > 0) {
			const file = files[0];
			setFile(file);
		}
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
							handleInputChange={(value: GooglePrediction) =>
								setPizzaPlace(value)
							}
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
								<ImageFileUpload
									file={file}
									setFile={setFile}
									handleFileChange={handleFileChange}
									alt="Pizza Slice"
								/>
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
