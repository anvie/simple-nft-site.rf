/** @type {import('next').NextConfig} */

const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: ".env" });

const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  images: {
    loader: "custom",
  },
  serverRuntimeConfig: {
    jwtSecret: process.env.JWT_SECRET,
    jwtSecretUser: process.env.JWT_SECRET_USER,
  },
  env: {
    NETWORK_ID: process.env.NETWORK_ID,
    SMART_CONTRACT_ADDRESS: process.env.SMART_CONTRACT_ADDRESS,
  }
};

module.exports = nextConfig;

