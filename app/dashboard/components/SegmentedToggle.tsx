import '@/styles/pages/dashboard.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface SegmentedToggleOption {
	value: string;
	label: string;
	icon?: string;
}

interface SegmentedToggleProps {
	label: string;
	value: string;
	onChange: (value: string) => void;
	options: SegmentedToggleOption[];
}

export default function SegmentedToggle({
	label,
	value,
	onChange,
	options,
}: SegmentedToggleProps) {
	return (
		<div className="segmented">
			<span className="segmented__label">{label}</span>
			<div className="segmented__group" role="radiogroup" aria-label={label}>
				{options.map((option) => {
					const selected = option.value === value;
					return (
						<button
							key={option.value}
							type="button"
							role="radio"
							aria-checked={selected}
							onClick={() => onChange(option.value)}
							className={`segmented__option ${selected ? 'segmented__option--selected' : ''}`}
						>
							{option.icon && (
								<FontAwesomeIcon
									icon={option.icon as never}
									className="segmented__icon"
								/>
							)}
							<span>{option.label}</span>
						</button>
					);
				})}
			</div>
		</div>
	);
}
