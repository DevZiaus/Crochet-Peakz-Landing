import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';
import { DM_Sans, Fraunces } from 'next/font/google';

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans' });
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-display' });

export const metadata: Metadata = {
    metadataBase: new URL(
        process.env.NEXT_PUBLIC_SITE_URL || 'https://crochetpeakz.tech',
    ),
    title: {
        default: 'Crochet PeakZ | Feel the handmade love',
        template: '%s | Crochet PeakZ',
    },
    description:
        'Handmade crochet pieces, patterns, and little moments of joy from Crochet PeakZ.',
    openGraph: {
        title: 'Crochet PeakZ',
        description: 'Feel the handmade love.',
        type: 'website',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
    return (
        <html lang='en'>
            <body className={`${dmSans.variable} ${fraunces.variable}`}>
                {children}
                {pixelId && (
                    <>
                        <Script
                            id='meta-pixel'
                            strategy='afterInteractive'
                        >{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');`}</Script>
                        <noscript>
                            <img
                                height='1'
                                width='1'
                                style={{ display: 'none' }}
                                src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
                                alt=''
                            />
                        </noscript>
                    </>
                )}
            </body>
        </html>
    );
}
