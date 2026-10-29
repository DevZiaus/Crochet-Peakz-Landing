import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Heart, Sparkles, Wand2 } from 'lucide-react';
import { PageFrame } from '@/components/site-shell';

export default function Home() {
    return (
        <PageFrame>
            <section className='hero'>
                <div className='container hero-grid'>
                    <div className='hero-copy'>
                        <div className='eyebrow'>
                            Made slowly, made with love
                        </div>
                        <h1>
                            Little things with a <em>big</em> heart.
                        </h1>
                        <p>
                            Welcome to Crochet PeakZ, a colorful corner for
                            thoughtfully handmade crochet pieces, patterns, and
                            the people who love making.
                        </p>
                        <div className='hero-actions'>
                            <Link href='/about' className='button button-dark'>
                                Discover our story <ArrowUpRight size={16} />
                            </Link>
                            <Link href='/store' className='text-link'>
                                The shop is coming soon
                            </Link>
                        </div>
                    </div>
                    <div className='hero-art'>
                        <div className='art-circle' />
                        <Image
                            className='hero-photo'
                            src='/images/photo_2026-10-25_19-54-27.jpg'
                            alt='Colorful handmade Crochet PeakZ logo'
                            width={768}
                            height={768}
                            priority
                        />
                        <div className='art-stamp'>
                            Handmade
                            <br />
                            with care
                        </div>
                        <div className='art-note'>
                            Your next favorite thing is being made.
                        </div>
                    </div>
                </div>
            </section>
            <section className='intro'>
                <div className='container intro-grid'>
                    <div>
                        <div className='eyebrow'>The PeakZ feeling</div>
                    </div>
                    <div>
                        <p className='intro-copy'>
                            Every loop is a small act of patience. We make{' '}
                            <strong>
                                joyful, useful, one-of-a-kind things
                            </strong>{' '}
                            that bring a little more texture and warmth to
                            everyday life.
                        </p>
                        <Link className='text-link' href='/about'>
                            Meet the maker <ArrowUpRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>
            <section className='feature-band'>
                <div className='container feature-grid'>
                    <article className='feature-card'>
                        <span>01</span>
                        <h3>Handmade for real life</h3>
                        <p>
                            Pieces designed to be used, loved, and lived with —
                            not tucked away.
                        </p>
                    </article>
                    <article className='feature-card'>
                        <span>02</span>
                        <h3>Made in small batches</h3>
                        <p>
                            Slow craft means fewer things, made better and with
                            a whole lot of intention.
                        </p>
                    </article>
                    <article className='feature-card'>
                        <span>03</span>
                        <h3>Created to make you smile</h3>
                        <p>
                            From tactile treasures to approachable patterns,
                            there is always a little delight.
                        </p>
                    </article>
                </div>
            </section>
            <section className='intro' style={{ paddingBottom: 130 }}>
                <div className='container' style={{ textAlign: 'center' }}>
                    <Sparkles size={25} color='var(--coral)' />
                    <h2>
                        Something lovely is <em>taking shape.</em>
                    </h2>
                    <p
                        style={{
                            color: 'var(--muted)',
                            maxWidth: 450,
                            margin: '0 auto 28px',
                        }}
                    >
                        Our online store is getting its finishing touches.
                        Follow along for the first peek at what’s next.
                    </p>
                    <Link href='/contact' className='button button-light'>
                        Keep me posted <ArrowUpRight size={16} />
                    </Link>
                </div>
            </section>
        </PageFrame>
    );
}
