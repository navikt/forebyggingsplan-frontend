/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const csp = require("./src/csp");

const nextConfig = {
    reactStrictMode: true,
    basePath: "/forebyggingsplan",
    swcMinify: true,
    output: "standalone",
    webpack: (config) => {
        config.watchOptions = {
            poll: 1000,
            aggregateTimeout: 300,
        };
        return config;
    },
    eslint: {
        dirs: ["."],
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cdn.sanity.io",
            },
        ],
    },
    async headers() {
        return [
            {
                // Følgende headers blir med i hver response
                source: "/:path*",
                headers: [
                    {
                        key: "X-Frame-Options",
                        value: "SAMEORIGIN",
                    },
                    {
                        key: "X-Xss-Protection",
                        value: "1; mode=block",
                    },
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "Referrer-Policy",
                        value: "no-referrer",
                    },
                    {
                        key: "Permissions-Policy",
                        value: "geolocation=(), microphone=(), camera=()",
                    },
                    {
                        key: "Content-Security-Policy",
                        value: csp,
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
