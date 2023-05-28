/** @type {import('next').NextConfig} */
require('dotenv').config();
const nextConfig = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/search',
                permanent: true,
            },
        ]
    },
}

module.exports = nextConfig
