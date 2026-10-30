'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ArrowUpRight, Instagram, Menu, X, Facebook } from 'lucide-react';

const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Our story', href: '/about' },
    { label: 'Store', href: '/store' },
    { label: 'Contact', href: '/contact' },
];

export function SiteHeader() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    return (
        <header className='site-header'>
            <div className='container header-inner'>
                <Link href='/' className='brand' onClick={() => setOpen(false)}>
                    <span className='brand-mark'>
                        <Image
                            src='/images/logo.jpg'
                            alt='Crochet PeakZ mountain mark'
                            width={64}
                            height={64}
                            loading='eager'
                        />
                    </span>
                    <span className='brand-name'>
                        Crochet <em>PeakZ</em>
                    </span>
                </Link>
                <nav className='desktop-nav' aria-label='Main navigation'>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={pathname === item.href ? 'active' : undefined}
                            aria-current={
                                pathname === item.href ? 'page' : undefined
                            }
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className='header-actions'>
                    <a
                        className='social-link'
                        href='https://www.facebook.com/crochet.peakz'
                        target='_blank'
                        rel='noreferrer'
                        aria-label='Visit Crochet PeakZ on Facebook'
                    >
                        <Facebook size={17} />
                    </a>
                    <a
                        className='social-link'
                        href='https://www.instagram.com/crochetpeakz/'
                        target='_blank'
                        rel='noreferrer'
                        aria-label='Visit Crochet PeakZ on Instagram'
                    >
                        <Instagram size={17} />
                    </a>
                    <Link className='header-cta' href='/contact'>
                        Say hello <ArrowUpRight size={16} />
                    </Link>
                    <button
                        className='menu-button'
                        type='button'
                        aria-label={
                            open ? 'Close navigation' : 'Open navigation'
                        }
                        aria-expanded={open}
                        onClick={() => setOpen((current) => !current)}
                    >
                        {open ? <X size={23} /> : <Menu size={23} />}
                    </button>
                </div>
            </div>
            {open && (
                <nav className='mobile-nav' aria-label='Mobile navigation'>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={pathname === item.href ? 'active' : undefined}
                            aria-current={
                                pathname === item.href ? 'page' : undefined
                            }
                            onClick={() => setOpen(false)}
                        >
                            {item.label}
                            <ArrowUpRight size={16} />
                        </Link>
                    ))}
                </nav>
            )}
        </header>
    );
}

export function SiteFooter() {
    return (
        <footer className='site-footer'>
            <div className='container footer-grid'>
                <div>
                    <Link href='/' className='footer-brand'>
                        Crochet <em>PeakZ</em>
                    </Link>
                    <p>Handmade pieces for everyday wonder.</p>
                </div>
                <div>
                    <p className='footer-label'>Explore</p>
                    <Link href='/about'>Our story</Link>
                    <Link href='/store'>Coming soon</Link>
                    <Link href='/contact'>Contact</Link>
                </div>
                <div>
                    <p className='footer-label'>Stay connected</p>
                    <a
                        href='https://www.facebook.com/crochet.peakz'
                        target='_blank'
                        rel='noreferrer'
                    >
                        Facebook <ArrowUpRight size={14} />
                    </a>
                    <a
                        href='https://www.instagram.com/crochetpeakz/'
                        target='_blank'
                        rel='noreferrer'
                    >
                        Instagram <ArrowUpRight size={14} />
                    </a>
                    <a href='mailto:hello@crochetpeakz.com'>
                        hello@crochetpeakz.tech
                    </a>
                </div>
            </div>
            <div className='container footer-bottom'>
                <span>© {new Date().getFullYear()} Crochet PeakZ</span>
                <span>
                    <Link href='/privacy'>Privacy</Link>
                    <Link href='/data-deletion'>Data deletion</Link>
                </span>
            </div>
        </footer>
    );
}

export function PageFrame({ children }: { children: React.ReactNode }) {
    return (
        <>
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
        </>
    );
}
