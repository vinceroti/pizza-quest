/** @type {import('next').NextConfig} */
const nextConfig = {
	sassOptions: {
		additionalData: `
      @import '@/styles/tools/_mixins';
      @import '@/styles/tools/_functions';
      @import '@/styles/settings/_globals';
      @import '@/styles/settings/_colors';
      @import '@/styles/settings/_fonts';
    `,
	},
};
module.exports = nextConfig;
