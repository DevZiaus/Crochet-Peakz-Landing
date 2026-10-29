import { Heart, Wand2 } from 'lucide-react';
import { PageFrame } from '@/components/site-shell';

export const metadata = { title: 'Our story' };

export default function About() {
  return <PageFrame><section className="page-hero"><div className="container"><div className="eyebrow">A little about us</div><h1>Crafted with care. <em>Shared with joy.</em></h1><p>Crochet PeakZ is a handmade fashion and lifestyle studio built around the magic of making something with your own two hands.</p></div></section><section className="story-section"><div className="container story-grid"><div><div className="eyebrow">Our why</div><h2>There’s magic in the <em>making.</em></h2></div><div><p>Crochet PeakZ began with a simple belief: the things we surround ourselves with should feel personal. A little imperfect. Made with intention.</p><p>We’re creating a place for handmade pieces that add warmth to your wardrobe, your home, and your everyday rituals — alongside patterns and guides for anyone ready to pick up a hook and make their own magic.</p><p className="quote">“Feel the handmade love” is more than a tagline. It’s how we want every piece to feel.</p><div className="values"><div className="value"><b><Heart size={23} /></b><div><h3>Warmth over perfection</h3><p>Handmade details are the point. Every stitch carries a little character.</p></div></div><div className="value"><b><Wand2 size={23} /></b><div><h3>Curiosity in every loop</h3><p>We keep learning, experimenting, and making room for joyful surprises.</p></div></div></div></div></div></section></PageFrame>;
}
