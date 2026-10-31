'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import { CONTACT_TOPICS } from '@/lib/contact';

type ContactResponse = {
    ok?: boolean;
    error?: string;
    retryAfterSeconds?: number;
};

export function ContactForm() {
    const [sent, setSent] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');
    const startedAt = useRef(0);

    useEffect(() => {
        startedAt.current = Date.now();
    }, []);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (sending) return;

        const formData = new FormData(event.currentTarget);

        setSending(true);
        setError('');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: String(formData.get('name') ?? ''),
                    email: String(formData.get('email') ?? ''),
                    topic: String(formData.get('topic') ?? ''),
                    message: String(formData.get('message') ?? ''),
                    website: String(formData.get('website') ?? ''),
                    elapsedMs: startedAt.current
                        ? Date.now() - startedAt.current
                        : 0,
                }),
            });

            const result = (await response
                .json()
                .catch(() => null)) as ContactResponse | null;

            if (!response.ok) {
                setError(
                    result?.error ||
                        'We could not send your message. Please try again in a moment.',
                );
                return;
            }

            setSent(true);
        } catch {
            setError(
                'We could not reach the server. Please check your connection and try again.',
            );
        } finally {
            setSending(false);
        }
    };

    if (sent) {
        return (
            <div className='form-success' role='status' aria-live='polite'>
                <span>
                    <Check size={20} />
                </span>
                <h2>Message received.</h2>
                <p>Thank you for reaching out. We’ll be in touch soon.</p>
            </div>
        );
    }

    return (
        <form className='contact-form' onSubmit={handleSubmit}>
            <div className='form-row'>
                <label>
                    Name
                    <input
                        name='name'
                        required
                        maxLength={100}
                        autoComplete='name'
                        placeholder='Your name'
                    />
                </label>
                <label>
                    Email
                    <input
                        name='email'
                        type='email'
                        required
                        maxLength={254}
                        autoComplete='email'
                        placeholder='you@example.com'
                    />
                </label>
            </div>
            <label>
                What can we help with?
                <select name='topic' defaultValue='general'>
                    {Object.entries(CONTACT_TOPICS).map(([value, label]) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>
            </label>
            <label>
                Message
                <textarea
                    name='message'
                    required
                    minLength={5}
                    maxLength={5000}
                    placeholder='Tell us a little more...'
                    rows={5}
                />
            </label>
            <div className='form-hp' aria-hidden='true'>
                <label>
                    Website
                    <input
                        name='website'
                        tabIndex={-1}
                        autoComplete='off'
                    />
                </label>
            </div>
            {error && (
                <p className='form-error' role='alert'>
                    {error}
                </p>
            )}
            <button
                className='button button-dark'
                type='submit'
                disabled={sending}
                aria-busy={sending}
            >
                {sending ? 'Sending…' : 'Send message'}
                {!sending && <ArrowUpRight size={16} />}
            </button>
        </form>
    );
}
