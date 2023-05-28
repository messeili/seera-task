import './globals.css'
import {Inter} from 'next/font/google'

const inter = Inter({subsets: ['latin']})

export const metadata = {
    title: 'Github User and Repo Search',
    description: 'Simple and easy app to search for users and repositories on Github',
}

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <meta name="description" content={metadata.description}/>
            <title>{metadata.title}</title>
            <link rel="icon" href="/favicon.ico"/>
            <link rel="preconnect" href="https://fonts.gstatic.com"/>
        </head>
        <body suppressHydrationWarning={true} className={inter.className}>
        {children}
        </body>
        </html>
    )
}
