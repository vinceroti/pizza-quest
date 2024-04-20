import { Mountain, States } from '@/config/enums/Mountains';

export const MountainUrls = {
	[States.Washington]: [
		{
			name: Mountain.CrystalMountain,
			url: 'https://api.weather.gov/gridpoints/SEW/145,31/forecast',
			state: States.Washington,
		},
		{
			name: Mountain.SummitAtSnoqualmie,
			url: 'https://api.weather.gov/gridpoints/SEW/152,54/forecast',
			state: States.Washington,
		},
		{
			name: Mountain.MtBaker,
			url: 'https://api.weather.gov/gridpoints/SEW/158,120/forecast',
			state: States.Washington,
		},
		{
			name: Mountain.StevensPass,
			url: 'https://api.weather.gov/gridpoints/OTX/25,115/forecast',
			state: States.Washington,
		},
	],
	[States.Oregon]: [
		{
			name: Mountain.MtHood,
			url: 'https://api.weather.gov/gridpoints/PQR/142,89/forecast',
			state: States.Oregon,
		},
		{
			name: Mountain.MtBachelor,
			url: 'https://api.weather.gov/gridpoints/PDT/30,54/forecast',
			state: States.Oregon,
		},
	],
	[States.Idaho]: [
		{
			name: Mountain.SunValley,
			url: 'https://api.weather.gov/gridpoints/PIH/131,174/forecast',
			state: States.Idaho,
		},
	],
	[States.Montana]: [
		{
			name: Mountain.BigSky,
			url: 'https://api.weather.gov/gridpoints/TFX/112,174/forecast',
			state: States.Montana,
		},
	],
	[States.Colorado]: [
		{
			name: Mountain.Vail,
			url: 'https://api.weather.gov/gridpoints/GJT/173,121/forecast',
			state: States.Colorado,
		},
		{
			name: Mountain.ArapahoeBasin,
			url: 'https://api.weather.gov/gridpoints/BOU/22,53/forecast',
			state: States.Colorado,
		},
		{
			name: Mountain.Breckenridge,
			url: 'https://api.weather.gov/gridpoints/BOU/22,53/forecast',
			state: States.Colorado,
		},
		{
			name: Mountain.CopperMountain,
			url: 'https://api.weather.gov/gridpoints/BOU/22,53/forecast',
			state: States.Colorado,
		},
		{
			name: Mountain.Keystone,
			url: 'https://api.weather.gov/gridpoints/BOU/22,53/forecast',
			state: States.Colorado,
		},
		{
			name: Mountain.Loveland,
			url: 'https://api.weather.gov/gridpoints/BOU/22,53/forecast',
			state: States.Colorado,
		},
		{
			name: Mountain.WinterPark,
			url: 'https://api.weather.gov/gridpoints/BOU/32,80/forecast',
			state: States.Colorado,
		},
		{
			name: Mountain.Steamboat,
			url: 'https://api.weather.gov/gridpoints/GJT/161,159/forecast',
			state: States.Colorado,
		},
		{
			name: Mountain.AspenSnowmass,
			url: 'https://api.weather.gov/gridpoints/GJT/156,102/forecast',
			state: States.Colorado,
		},
		{
			name: Mountain.Telluride,
			url: 'https://api.weather.gov/gridpoints/GJT/113,50/forecast',
			state: States.Colorado,
		},
		{
			name: Mountain.CrestedButte,
			url: 'https://api.weather.gov/gridpoints/GJT/150,88/forecast',
			state: States.Colorado,
		},
		{
			name: Mountain.Purgatory,
			url: 'https://api.weather.gov/gridpoints/GJT/120,40/forecast',
			state: States.Colorado,
		},
		{
			name: Mountain.WolfCreek,
			url: 'https://api.weather.gov/gridpoints/PUB/15,35/forecast',
			state: States.Colorado,
		},
		{
			name: Mountain.Silverton,
			url: 'https://api.weather.gov/gridpoints/GJT/120,40/forecast',
			state: States.Colorado,
		},
		{
			name: Mountain.Powderhorn,
			url: 'https://api.weather.gov/gridpoints/GJT/143,64/forecast',
			state: States.Colorado,
		},
	],
	[States.California]: [
		{
			name: Mountain.MammothMountain,
			url: 'https://api.weather.gov/gridpoints/REV/70,33/forecast',
			state: States.California,
		},
	],
	[States.Utah]: [
		{
			name: Mountain.ParkCity,
			url: 'https://api.weather.gov/gridpoints/SLC/146,220/forecast',
			state: States.Utah,
		},
	],
};
