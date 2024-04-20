import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useMemo } from 'react';

import { Mountain, States } from '@/config/enums/Mountains';
import { MountainUrls } from '@/config/settings';

interface ResortsProps {
	onResortsChange: (resorts: Mountain[]) => void;
	region: States;
	resorts: Mountain[];
}

const Resorts = ({ onResortsChange, region, resorts }: ResortsProps) => {
	const ResortKeys = useMemo(
		() => Object.values(MountainUrls[region]).map(({ name }) => name),
		[region],
	);

	const handleChange = (event: SelectChangeEvent<typeof resorts>) => {
		const value = event.target.value;
		const newValue = (
			typeof value === 'string' ? value.split(',') : value
		) as Mountain[];
		onResortsChange(newValue);
	};

	return (
		<FormControl
			sx={{
				width: '100%',
				background: '#fff',
				borderRadius: '5px',
				marginBottom: '1rem',
			}}
			variant="filled"
			size="small"
		>
			<InputLabel id="demo-select-small-label">Resorts</InputLabel>
			<Select
				labelId="demo-select-small-label"
				id="demo-select-small"
				value={resorts}
				label="Resorts"
				onChange={handleChange}
				renderValue={(selected) => selected.join(', ')}
				variant="filled"
				multiple
			>
				{ResortKeys.map((resortKey) => (
					<MenuItem key={resortKey} value={resortKey}>
						<Checkbox checked={resorts.indexOf(resortKey) > -1} />
						<ListItemText primary={resortKey} />
					</MenuItem>
				))}
			</Select>
			<div className="flex justify-center gap-2">
				<Button
					variant="text"
					className="p-1"
					onClick={() => onResortsChange(ResortKeys)}
				>
					Select All
				</Button>
				<Button
					variant="text"
					className="p-1"
					onClick={() => onResortsChange([])}
				>
					Clear
				</Button>
			</div>
		</FormControl>
	);
};

export default Resorts;
