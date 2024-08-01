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
	images: {
		domains: ['pizza-quest.s3.us-east-2.amazonaws.com'],
	},
};
module.exports = nextConfig;
