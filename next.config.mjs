import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "lh3.googleusercontent.com" },
      { hostname: "i.pravatar.cc" },
      { hostname: "ui-avatars.com" },
    ],
  },
};

export default withNextIntl(nextConfig);
