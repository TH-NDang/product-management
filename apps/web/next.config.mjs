/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: ["@workspace/ui"],
	async rewrites() {
		return [
			{
				source: "/api/:path*",
				destination: "http://localhost:8000/:path*",
			},
		];
	},
};

export default nextConfig;
