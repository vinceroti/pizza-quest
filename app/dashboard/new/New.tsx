'use client';

import LoadingButton from '@mui/lab/LoadingButton';
import { Alert, FormControl, FormGroup, Grid, TextField } from '@mui/material';
import { PizzaFormat, PizzaSource } from '@prisma/client';
import { useState } from 'react';

import { submitSlice } from '@/app/actions';
import GooglePrediction from '@/interfaces/models/GooglePrediction';
import { type PizzaSlice } from '@/interfaces/models/PizzaSlice';
import { toBase64 } from '@/utils/fileUtils';
import { pizzaValidation } from '@/utils/validation';

import ImageFileUpload from '../components/shared/ImageFileUpload';
import PizzaPlaceAutoComplete from '../components/submit/PizzaPlaceAutoComplete';
import RatingInput from '../components/submit/RatingInput';
import SegmentedToggle from '../components/submit/SegmentedToggle';
import SuccessMessage from '../components/submit/SuccessMessage';

export default function New() {
	const [pizzaPlace, setPizzaPlace] = useState<GooglePrediction | null>(null);
	const [customPlaceName, setCustomPlaceName] = useState('');
	const [source, setSource] = useState<PizzaSource>('PURCHASED');
	const [format, setFormat] = useState<PizzaFormat>('SLICE');
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

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setErrorMessage('');

		const fileBase64 = file ? await toBase64(file) : null;

		const data = {
			pizzaPlace,
			customPlaceName,
			source,
			format,
			overall,
			crustDough,
			sauce,
			toppingToPizzaRatio,
			creativity,
			authenticity,
			notes,
			image: { type: file?.type, data: fileBase64 },
		};

		const errorMsg = pizzaValidation(data);

		if (errorMsg) {
			setErrorMessage(errorMsg);
			return;
		}

		setLoading(true);

		try {
			await submitSlice(data as Omit<PizzaSlice, 'userId'>);
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
		<div className="form-container">
			<h4 className="mb-1 text-center">Rate a Slice</h4>
			<p className="mb-5 text-center submit-page__subtitle">
				The good, the bad, the soggy. Tell us about it.
			</p>
			{success ? (
				<SuccessMessage />
			) : (
				<FormControl
					component="form"
					onSubmit={handleSubmit}
					sx={{ width: '100%' }}
				>
					<FormGroup>
						<div className="submit-toggles">
							<SegmentedToggle
								label="Source"
								value={source}
								onChange={(v) => setSource(v as PizzaSource)}
								options={[
									{ value: 'PURCHASED', label: 'Purchased', icon: 'store' },
									{ value: 'HOMEMADE', label: 'Homemade', icon: 'house' },
								]}
							/>
							<SegmentedToggle
								label="Format"
								value={format}
								onChange={(v) => setFormat(v as PizzaFormat)}
								options={[
									{ value: 'SLICE', label: 'Slice', icon: 'pizza-slice' },
									{
										value: 'WHOLE_PIE',
										label: 'Whole Pie',
										icon: 'circle',
									},
								]}
							/>
						</div>
						{source === 'PURCHASED' ? (
							<PizzaPlaceAutoComplete
								handleInputChange={(value: GooglePrediction | null) =>
									setPizzaPlace(value)
								}
							/>
						) : (
							<div className="w-full max-w-md mx-auto mb-3">
								<TextField
									label="Name your homemade pizza"
									value={customPlaceName}
									onChange={(e) => setCustomPlaceName(e.target.value)}
									placeholder="Mom's recipe, Friday night dough, etc."
									fullWidth
									inputProps={{
										autoCapitalize: 'words',
										autoCorrect: 'off',
										spellCheck: 'false',
										maxLength: 80,
									}}
								/>
							</div>
						)}
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
