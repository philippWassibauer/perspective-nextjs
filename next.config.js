const PerspectivePlugin = require("@finos/perspective-webpack-plugin");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: function (config, { isServer }) {
    config.experiments = {
      ...config.experiments,
    };

    if (!isServer) {
      config.plugins.push(new PerspectivePlugin());
    }

    config.module.rules.push({
      test: /\.arrow$/,
      use: [{ loader: "arraybuffer-loader" }],
    });

    return config;
  },
};

module.exports = nextConfig;
