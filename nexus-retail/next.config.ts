import type { NextConfig } from "next";

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://apis.google.com https://www.gstatic.com https://*.google.com;
    connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.stripe.com https://*.google.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://firebasestorage.googleapis.com https://lh3.googleusercontent.com https://*.googleusercontent.com;
    font-src 'self' https://fonts.gstatic.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self' https://*.firebaseapp.com https://*.google.com;
    frame-src 'self' https://js.stripe.com https://*.firebaseapp.com https://*.google.com;
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
`;

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/discover',
        destination: '/shop/discover',
        permanent: true,
      },
      {
        source: '/checkout',
        destination: '/shop/checkout',
        permanent: true,
      },
      {
        source: '/checkout/success',
        destination: '/shop/checkout/success',
        permanent: true,
      },
      {
        source: '/profile',
        destination: '/shop/profile',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\n/g, ""),
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Ext-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
