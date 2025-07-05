import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
	// Performance optimizations
	experimental: {
		// Optimize dependency resolution
		optimizePackageImports: [
			"lucide-react",
			"@radix-ui/react-accordion",
			"@radix-ui/react-avatar",
			"@radix-ui/react-dialog",
			"@radix-ui/react-progress",
			"@radix-ui/react-slot",
			"@radix-ui/react-tabs",
		],
	},

	// Enable Turbopack for faster builds (now stable)
	turbopack: {},

	// Silence warnings
	// https://github.com/WalletConnect/walletconnect-monorepo/issues/1908
	webpack: (config, { dev, isServer }) => {
		config.externals.push("pino-pretty", "lokijs", "encoding");

		// Handle React Native dependencies in MetaMask SDK
		config.resolve.fallback = {
			...config.resolve.fallback,
			"@react-native-async-storage/async-storage": false,
		};

		// Performance optimizations for development
		if (dev) {
			config.cache = {
				type: "filesystem",
				buildDependencies: {
					config: [__filename],
				},
			};
		}

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
