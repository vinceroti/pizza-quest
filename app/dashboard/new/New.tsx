'use client';

import LoadingButton from '@mui/lab/LoadingButton';
import { Alert, FormControl, FormGroup, Grid, TextField } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

import { submitSlice } from '@/app/actions';
import GooglePrediction from '@/interfaces/models/GooglePrediction';
import { PizzaSlice } from '@/interfaces/models/PizzaSlice';
import { pizzaValidation } from '@/utils/validation';

import ImageFileUpload from '../components/ImageFileUpload';
import PizzaPlaceAutoComplete from '../components/PizzaPlaceAutoComplete';
import RatingInput from '../components/RatingInput';
import SuccessMessage from '../components/SuccessMessage';

export default function Dashboard() {
	const { data: session } = useSession();

	const [pizzaPlace, setPizzaPlace] = useState<GooglePrediction | null>(null);
	const [overall, setOverall] = useState<number | null>(0);
	const [crustDough, setCrustDough] = useState<number | null>(0);
	const [sauce, setSauce] = useState<number | null>(0);
	const [toppingToPizzaRatio, setToppingToPizzaRatio] = useState<number | null>(
		0,
	);
	const [creativity, setCreativity] = useState<number | null>(0);
	const [authenticity, setAuthenticity] = useState<number | null>(0);
	const [notes, setNotes] = useState('');
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [file, setFile] = useState<File | null>(null);
	const [success, setSuccess] = useState(false);

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
			await submitSlice(data as PizzaSlice);
			setSuccess(true);
		} catch (error: unknown) {
			setErrorMessage((error as Error).message);
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
		<div
			style={{
				width: '100%',
				maxWidth: '800px',
				margin: '0 auto',
				padding: '0 1rem',
			}}
		>
			<h4 className="mb-3 text-center">Upload and Rate Pizza Slices</h4>
			{success ? (
				<SuccessMessage message="Your pizza slice rating has been submitted successfully." />
			) : (
				<FormControl
					component="form"
					onSubmit={handleSubmit}
					sx={{ width: '100%' }}
				>
					<FormGroup>
						<PizzaPlaceAutoComplete
							handleInputChange={(value: GooglePrediction | null) =>
								setPizzaPlace(value)
							}
						/>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<RatingInput
									label="Overall Rating"
									name="overall-rating"
									value={overall}
									onChange={setOverall}
								/>
								<RatingInput
									label="Crust/Dough Rating"
									name="crust-dough-rating"
									value={crustDough}
									onChange={setCrustDough}
								/>
								<RatingInput
									label="Authenticity"
									name="authenticity"
									value={authenticity}
									onChange={setAuthenticity}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<RatingInput
									label="Sauce Rating"
									name="sauce-rating"
									value={sauce}
									onChange={setSauce}
								/>
								<RatingInput
									label="Topping to Pizza Ratio"
									name="topping-to-pizza-ratio"
									value={toppingToPizzaRatio}
									onChange={setToppingToPizzaRatio}
								/>
								<RatingInput
									label="Creativity"
									name="creativity"
									value={creativity}
									onChange={setCreativity}
								/>
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
