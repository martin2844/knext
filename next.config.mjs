/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true,
    serverComponentsExternalPackages: ["knex"],
  },
  output: "standalone",
};

export default nextConfig;
