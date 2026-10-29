import Link from 'next/link';
import { ArrowUpRight, Bell, PackageOpen } from 'lucide-react';
import { PageFrame } from '@/components/site-shell';

export const metadata = { title: 'Store' };

export default function Store() {
  return <PageFrame><section className="page-hero"><div className="container"><div className="eyebrow">The PeakZ shop</div><h1>Good things are <em>coming soon.</em></h1><p>We’re carefully preparing a collection of handmade pieces, customizable treasures, and digital patterns for you to enjoy.</p></div></section><section className="store-panel"><div className="container"><PackageOpen size={34} color="var(--coral)" /><h2>A small shop with a <em>big personality.</em></h2><p>Be the first to know when the doors open and discover the first collection from Crochet PeakZ.</p><Link href="/contact" className="button button-dark">Get launch updates <Bell size={16} /></Link><div className="store-card"><h3>Handmade pieces<br />for everyday wonder.</h3><p>One-of-a-kind accessories, made-to-order designs, and patterns to make at home.</p><Link href="/about" className="text-link">Learn about our craft <ArrowUpRight size={16} /></Link></div></div></section></PageFrame>;
}
