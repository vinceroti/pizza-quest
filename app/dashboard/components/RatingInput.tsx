'use client';

import Image from 'next/image';
import { useCallback, useState } from 'react';

type RatingInputProps = {
	label: string;
	value: number | null;
	onChange: (value: number | null) => void;
	name: string;
};

const SLICE_SIZE = 28;

export default function RatingInput({
	label,
	value,
	onChange,
	name,
}: RatingInputProps) {
	const [hoverValue, setHoverValue] = useState<number | null>(null);
	const displayValue = hoverValue ?? value ?? 0;

	const getValueFromEvent = useCallback(
		(index: number, e: React.MouseEvent) => {
			const rect = e.currentTarget.getBoundingClientRect();
			const isLeftHalf = e.clientX - rect.left < rect.width / 2;
			return isLeftHalf ? index + 0.5 : index + 1;
		},
		[],
	);

	return (
		<div className="mb-4 mt-4">
			<p className="mb-2">{label}</p>
			<div
				className="inline-flex items-center gap-1"
				role="radiogroup"
				aria-label={name}
				onMouseLeave={() => setHoverValue(null)}
			>
				{[0, 1, 2, 3, 4].map((index) => {
					const filled = displayValue >= index + 1;
					const halfFilled = !filled && displayValue >= index + 0.5;

					return (
						<button
							key={index}
							type="button"
							onClick={(e) => {
								const newVal = getValueFromEvent(index, e);
								onChange(newVal === value ? null : newVal);
							}}
							onMouseMove={(e) =>
								setHoverValue(getValueFromEvent(index, e))
							}
							className="relative block"
							style={{
								width: SLICE_SIZE,
								height: SLICE_SIZE,
								cursor: 'pointer',
								background: 'none',
								border: 'none',
								padding: 0,
							}}
							aria-label={`${index + 1} slice${index === 0 ? '' : 's'}`}
						>
							{halfFilled ? (
								<>
									<Image
										src="/pizza-slice-single.webp"
										alt=""
										width={SLICE_SIZE}
										height={SLICE_SIZE}
										style={{
											objectFit: 'contain',
											display: 'block',
											clipPath: 'inset(0 50% 0 0)',
											transition:
												'opacity 0.2s ease, transform 0.2s ease',
											transform: 'scale(1.05)',
										}}
										draggable={false}
									/>
									<Image
										src="/pizza-slice-single.webp"
										alt=""
										width={SLICE_SIZE}
										height={SLICE_SIZE}
										className="opacity-30 absolute top-0 left-0"
										style={{
											objectFit: 'contain',
											display: 'block',
											clipPath: 'inset(0 0 0 50%)',
											transition: 'opacity 0.2s ease',
										}}
										draggable={false}
									/>
								</>
							) : (
								<Image
									src="/pizza-slice-single.webp"
									alt=""
									width={SLICE_SIZE}
									height={SLICE_SIZE}
									className={filled ? '' : 'opacity-30'}
									style={{
										objectFit: 'contain',
										display: 'block',
										transition:
											'opacity 0.2s ease, transform 0.2s ease',
										transform: filled
											? 'scale(1.1)'
											: 'scale(1)',
									}}
									draggable={false}
								/>
							)}
						</button>
					);
				})}
			</div>
		</div>
	);
}
