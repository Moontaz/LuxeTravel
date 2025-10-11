/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_BUS_URL: process.env.NEXT_PUBLIC_BUS_URL,
    NEXT_PUBLIC_FOOD_URL: process.env.NEXT_PUBLIC_FOOD_URL,
    NEXT_PUBLIC_FOOD_SERVICE_EMAIL: process.env.NEXT_PUBLIC_FOOD_SERVICE_EMAIL,
    NEXT_PUBLIC_FOOD_SERVICE_PASSWORD:
      process.env.NEXT_PUBLIC_FOOD_SERVICE_PASSWORD,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
};

export default nextConfig;
