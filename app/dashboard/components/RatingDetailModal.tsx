import { Box, Modal } from '@mui/material';

import PizzaRatingDisplay from './PizzaRatingDisplay';

type RatingData = {
	overall?: number;
	crustDough?: number;
	sauce?: number;
	toppingToPizzaRatio?: number;
	creativity?: number;
	authenticity?: number;
};

type RatingDetailModalProps = {
	open: boolean;
	username?: string;
	placeName?: string;
	rating?: RatingData;
	onClose: () => void;
};

export default function RatingDetailModal({
	open,
	username,
	placeName,
	rating,
	onClose,
}: RatingDetailModalProps) {
	return (
		<Modal
			open={open}
			onClose={onClose}
			aria-labelledby="rating-modal-title"
			aria-describedby="rating-modal-description"
		>
			<Box
				sx={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: { xs: '90vw', sm: 600 },
					maxWidth: 600,
					bgcolor: 'rgba(30, 58, 95, 0.95)',
					backdropFilter: 'blur(10px)',
					border: '1px solid rgba(77, 144, 254, 0.2)',
					boxShadow: 24,
					p: { xs: 2, sm: 4 },
					color: 'text.primary',
				}}
			>
				<h5 id="rating-modal-title">
					{username} Rating for {placeName}
				</h5>
				<div
					id="rating-modal-description"
					className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-5"
				>
					<p>
						Overall: <PizzaRatingDisplay rating={rating?.overall} />
					</p>
					<p>
						Crust Dough: <PizzaRatingDisplay rating={rating?.crustDough} />
					</p>
					<p>
						Sauce: <PizzaRatingDisplay rating={rating?.sauce} />
					</p>
					<p>
						Topping to Pizza Ratio:{' '}
						<PizzaRatingDisplay rating={rating?.toppingToPizzaRatio} />
					</p>
					<p>
						Creativity: <PizzaRatingDisplay rating={rating?.creativity} />
					</p>
					<p>
						Authenticity: <PizzaRatingDisplay rating={rating?.authenticity} />
					</p>
				</div>
			</Box>
		</Modal>
	);
}
