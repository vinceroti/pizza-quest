import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { States } from '@/config/enums/Mountains';
import { MountainUrls } from '@/config/settings';

const StateKeys = Object.keys(MountainUrls) as States[];

interface RegionsProps {
	onRegionChange: (region: States) => void;
	region: string;
}

const Regions = ({ onRegionChange, region }: RegionsProps) => {
	const handleChange = (event: SelectChangeEvent<typeof region>) => {
		const {
			target: { value },
		} = event;
		onRegionChange(value as States);
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
			<InputLabel id="demo-select-small-label">Region</InputLabel>
			<Select
				labelId="demo-select-small-label"
				id="demo-select-small"
				value={region}
				label="region"
				onChange={handleChange}
				variant="filled"
			>
				{StateKeys.map((state) => (
					<MenuItem key={state} value={state}>
						{state}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
};

export default Regions;
