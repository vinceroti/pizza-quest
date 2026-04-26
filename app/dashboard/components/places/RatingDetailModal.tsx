import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, IconButton, Modal } from '@mui/material';
import { PizzaFormat, PizzaSource } from '@prisma/client';

import PizzaRatingDisplay from '../shared/PizzaRatingDisplay';
import SourceFormatBadges from './SourceFormatBadges';

type RatingData = {
	overall?: number;
	crustDough?: number;
	sauce?: number;
	toppingToPizzaRatio?: number;
	creativity?: number;
	authenticity?: number;
	source?: PizzaSource;
	format?: PizzaFormat;
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
					maxHeight: { xs: '90vh', sm: '85vh' },
					overflowY: 'auto',
					bgcolor: 'rgba(30, 58, 95, 0.95)',
					backdropFilter: 'blur(10px)',
					border: '1px solid rgba(77, 144, 254, 0.2)',
					borderRadius: '16px',
					boxShadow: 24,
					p: { xs: 2.5, sm: 4 },
					pr: { xs: 6, sm: 6 },
					color: 'text.primary',
				}}
			>
				<IconButton
					onClick={onClose}
					aria-label="Close rating details"
					sx={{
						position: 'absolute',
						top: 8,
						right: 8,
						width: 44,
						height: 44,
						color: 'rgba(255,255,255,0.85)',
					}}
				>
					<FontAwesomeIcon icon="xmark" />
				</IconButton>

				<header className="rating-modal__header">
					<h5
						id="rating-modal-title"
						className="rating-modal__title"
					>
						{username}
					</h5>
					{placeName && (
						<p className="rating-modal__place">{placeName}</p>
					)}
				</header>

				<SourceFormatBadges
					source={rating?.source}
					format={rating?.format}
					className="flex flex-wrap gap-2 mt-3"
				/>

				<h6 className="rating-modal__section-label">Rating Breakdown</h6>
				<dl
					id="rating-modal-description"
					className="rating-modal__breakdown"
				>
					<BreakdownRow label="Overall" rating={rating?.overall} />
					<BreakdownRow label="Crust / Dough" rating={rating?.crustDough} />
					<BreakdownRow label="Sauce" rating={rating?.sauce} />
					<BreakdownRow
						label="Topping Ratio"
						rating={rating?.toppingToPizzaRatio}
					/>
					<BreakdownRow label="Creativity" rating={rating?.creativity} />
					<BreakdownRow label="Authenticity" rating={rating?.authenticity} />
				</dl>
			</Box>
		</Modal>
	);
}

function BreakdownRow({
	label,
	rating,
}: {
	label: string;
	rating?: number;
}) {
	return (
		<div className="rating-modal__breakdown-row">
			<dt className="rating-modal__breakdown-label">{label}</dt>
			<dd className="rating-modal__breakdown-value">
				<PizzaRatingDisplay rating={rating} />
			</dd>
		</div>
	);
}
