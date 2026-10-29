'use client';

import { FormEvent, useState } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  if (sent) return <div className="form-success"><span><Check size={20} /></span><h2>Message received.</h2><p>Thank you for reaching out. We’ll be in touch soon.</p></div>;

  return <form className="contact-form" onSubmit={handleSubmit}>
    <div className="form-row"><label>Name<input name="name" required placeholder="Your name" /></label><label>Email<input name="email" type="email" required placeholder="you@example.com" /></label></div>
    <label>What can we help with?<select name="topic" defaultValue="general"><option value="general">A general hello</option><option value="custom">A custom piece</option><option value="patterns">Patterns & guides</option><option value="stock">A store question</option></select></label>
    <label>Message<textarea name="message" required placeholder="Tell us a little more..." rows={5} /></label>
    <button className="button button-dark" type="submit">Send message <ArrowUpRight size={16} /></button>
  </form>;
}
