/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    BACKEND_GRAPHQL_URL: process.env.BACKEND_GRAPHQL_URL
  }
}
