import Link from 'next/link';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { PageFrame } from '@/components/site-shell';

export const metadata = { title: 'Data deletion' };

export default function DataDeletion() {
  return <PageFrame><section className="page-hero"><div className="container"><div className="eyebrow">You’re in control</div><h1>Want your data <em>deleted?</em></h1><p>We’ll keep the process simple, clear, and respectful.</p></div></section><section className="legal-section container"><h2>How to request deletion</h2><p>Send an email to <a className="text-link" href="mailto:hello@crochetpeakz.com?subject=Data%20deletion%20request">hello@crochetpeakz.com</a> with the subject “Data deletion request”. Please include the email address or name connected to your request so we can find the right information.</p><h2>What happens next</h2><ul><li>We’ll confirm that we received your request.</li><li>We’ll remove personal information we control, unless we’re legally required to keep specific records.</li><li>We’ll let you know when the request is complete.</li></ul><h2>Need help?</h2><p>If you’re unsure what to include, simply write to us and we’ll guide you. You can also return to our <Link className="text-link" href="/privacy">privacy policy <ArrowUpRight size={14} /></Link>.</p><div className="store-card" style={{ marginTop: 52, textAlign: 'center' }}><CheckCircle2 size={30} color="var(--coral)" /><h3>Your information belongs to you.</h3></div></section></PageFrame>;
}
