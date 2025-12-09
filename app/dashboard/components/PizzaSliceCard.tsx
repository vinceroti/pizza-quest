import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Prisma } from '@prisma/client';
import { formatDistanceToNow } from 'date-fns';

import { getAllPizzaSliceData } from '@/app/actions';

import CommentSection from './CommentSection';
import LikeSection from './LikeSection';
import PizzaRatingDisplay from './PizzaRatingDisplay';

type PizzaSlice = Prisma.PromiseReturnType<typeof getAllPizzaSliceData>[number];

type PizzaSliceCardProps = {
	slice: PizzaSlice;
};

export default function PizzaSliceCard({ slice }: PizzaSliceCardProps) {
	return (
		<Card
			sx={{
				padding: '16px',
				maxWidth: '500px',
				marginBottom: '16px',
				width: '100%',
				display: 'flex',
				flexWrap: 'wrap',
				transition: 'all 0.3s ease',
				'&:hover': {
					transform: 'translateY(-4px)',
					boxShadow: '0 8px 24px rgba(77, 144, 254, 0.3)',
				},
			}}
		>
			<div className="flex items-center mb-3 w-full">
				<FontAwesomeIcon
					icon="user-circle"
					className="text-gray-500 mr-2"
					size="2x"
				/>
				<h6 className="m-0">{slice.user.username}</h6>
				<span className="mr-2 ml-2">•</span>
				<p className="m-0">
					{formatDistanceToNow(new Date(slice.createdAt))} ago
				</p>
			</div>
			<CardMedia
				component="img"
				sx={{
					height: '100%',
					width: '100%',
					objectFit: 'contain',
					maxHeight: '500px',
					objectPosition: 'center',
				}}
				image={slice.image || ''}
				alt="Pizza image"
			/>
			<CardContent
				sx={{
					padding: '1rem 1rem .5rem',
					':last-child': { padding: '1rem 1rem .5rem' },
					width: '100%',
				}}
			>
				<div className="text-left">
					<div className="flex items-center justify-between">
						<PizzaRatingDisplay rating={slice.overall} />
						<LikeSection likes={slice.likes} pizzaSliceRatingId={slice.id} />
					</div>
					<h5 className="mt-2 mb-0">{slice.pizzaPlace.mainText}</h5>
					{slice.notes && <p className="mt-2">{slice.notes}</p>}
				</div>
				<CommentSection
					comments={slice.comments}
					pizzaSliceRatingId={slice.id}
				/>
			</CardContent>
		</Card>
	);
}
