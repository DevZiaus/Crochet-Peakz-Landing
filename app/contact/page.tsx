import { PageFrame } from '@/components/site-shell';
import { ContactForm } from '@/components/contact-form';

export const metadata = { title: 'Contact' };

export default function Contact() {
    return (
        <PageFrame>
            <section className='page-hero'>
                <div className='container'>
                    <div className='eyebrow'>Come say hello</div>
                    <h1>
                        Let’s make something <em>lovely.</em>
                    </h1>
                    <p>
                        Have a question, an idea, or just want to share some
                        handmade love? We’d be happy to hear from you.
                    </p>
                </div>
            </section>
            <section className='contact-section'>
                <div className='container contact-grid'>
                    <div className='contact-intro'>
                        <div className='eyebrow'>Get in touch</div>
                        <h2>
                            We’re all <em>ears.</em>
                        </h2>
                        <p>
                            Whether you’re curious about a custom piece or want
                            to follow the journey, send us a note and we’ll get
                            back to you as soon as we can.
                        </p>
                        <div className='contact-details'>
                            <div>
                                <span>Email</span>
                                <a
                                    className='contact-email'
                                    href='mailto:hello@crochetpeakz.tech'
                                >
                                    hello@crochetpeakz.tech
                                </a>
                            </div>
                            <div>
                                <span>Social</span>
                                <a
                                    className='contact-facebook'
                                    href='https://www.facebook.com/crochet.peakz'
                                    target='_blank'
                                    rel='noreferrer'
                                >
                                    Facebook / crochet.peakz
                                </a>
                                <a
                                    className='contact-instagram'
                                    href='https://www.instagram.com/crochetpeakz/'
                                    target='_blank'
                                    rel='noreferrer'
                                >
                                    Instagram / crochetpeakz
                                </a>
                            </div>
                        </div>
                    </div>
                    <ContactForm />
                </div>
            </section>
        </PageFrame>
    );
}
