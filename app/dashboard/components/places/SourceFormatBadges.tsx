import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PizzaFormat, PizzaSource } from '@prisma/client';

interface SourceFormatBadgesProps {
	source?: PizzaSource | null;
	format?: PizzaFormat | null;
	className?: string;
}

export default function SourceFormatBadges({
	source,
	format,
	className = 'rating-card__badges',
}: SourceFormatBadgesProps) {
	if (!source && !format) return null;

	return (
		<div className={className}>
			{source && (
				<span className="badge">
					<FontAwesomeIcon
						icon={source === 'HOMEMADE' ? 'house' : 'store'}
					/>
					{source === 'HOMEMADE' ? 'Homemade' : 'Purchased'}
				</span>
			)}
			{format && (
				<span className="badge badge--gold">
					<FontAwesomeIcon
						icon={format === 'WHOLE_PIE' ? 'circle' : 'pizza-slice'}
					/>
					{format === 'WHOLE_PIE' ? 'Whole Pie' : 'Slice'}
				</span>
			)}
		</div>
	);
}
