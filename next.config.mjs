/** @type {import('next').NextConfig} */
const nextConfig = {
	// Silence warnings
	// https://github.com/WalletConnect/walletconnect-monorepo/issues/1908
	webpack: (config) => {
		config.externals.push("pino-pretty", "lokijs", "encoding");

		// Handle React Native dependencies in MetaMask SDK
		config.resolve.fallback = {
			...config.resolve.fallback,
			"@react-native-async-storage/async-storage": false,
		};

		return config;
	},

	// Image optimization for external avatar sources
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**", // Allow all HTTPS domains
			},
			{
				protocol: "http",
				hostname: "localhost",
				port: "3000",
			},
			{
				protocol: "http",
				hostname: "localhost",
				port: "3002",
			},
		],
	},
};

export default nextConfig;
