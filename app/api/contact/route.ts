import { Resend } from 'resend';
import { CONTACT_TOPICS, isContactTopic } from '@/lib/contact';
import {
    checkContactRateLimit,
    clearContactRateLimit,
    getClientIp,
} from '@/lib/rate-limit';

export const runtime = 'nodejs';

const MIN_NAME_LENGTH = 1;
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MIN_MESSAGE_LENGTH = 5;
const MAX_MESSAGE_LENGTH = 5000;
const MIN_FILL_TIME_MS = 3000;
const MAX_REQUESTS_BYTES = 20_000;
const MAX_LINKS_IN_MESSAGE = 3;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type ContactPayload = {
    name: string;
    email: string;
    topic: string;
    message: string;
    website: string;
};

function jsonResponse(
    body: unknown,
    status = 200,
    headers?: Record<string, string>,
) {
    return Response.json(body, {
        status,
        headers: { 'Cache-Control': 'no-store', ...headers },
    });
}

function readString(value: unknown): string {
    return typeof value === 'string' ? value : '';
}

function escapeHtml(value: string): string {
    const entities: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    };

    return value.replace(/[&<>"']/g, (character) => entities[character]);
}

function isSameOrigin(request: Request): boolean {
    if (request.headers.get('sec-fetch-site') === 'cross-site') {
        return false;
    }

    const origin = request.headers.get('origin');
    if (!origin) return true;

    try {
        const originHost = new URL(origin).host;
        const requestHost = (
            request.headers.get('x-forwarded-host') ??
            request.headers.get('host') ??
            ''
        )
            .split(',')[0]
            .trim();

        return Boolean(requestHost) && originHost === requestHost;
    } catch {
        return false;
    }
}

function buildEmailContent(payload: ContactPayload) {
    const topicLabel = isContactTopic(payload.topic)
        ? CONTACT_TOPICS[payload.topic]
        : payload.topic;
    const submittedAt = new Date().toISOString();
    const escapedName = escapeHtml(payload.name);
    const escapedEmail = escapeHtml(payload.email);
    const escapedTopic = escapeHtml(topicLabel);
    const escapedMessage = escapeHtml(payload.message).replace(
        /\r?\n/g,
        '<br />',
    );

    const text = [
        'New contact message from Crochet PeakZ',
        '',
        `Name: ${payload.name}`,
        `Email: ${payload.email}`,
        `Topic: ${topicLabel}`,
        `Submitted: ${submittedAt}`,
        '',
        'Message:',
        payload.message,
        '',
        'Reply directly to this email to respond.',
    ].join('\n');

    const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f6f4ed;color:#1f2922;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f4ed;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#fffdf8;border:1px solid #dfe4da;">
            <tr>
              <td style="padding:28px 32px;border-bottom:1px solid #dfe4da;">
                <div style="font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#667067;font-weight:700;">Crochet PeakZ</div>
                <h1 style="margin:8px 0 0;font-size:28px;line-height:1.2;color:#1f2922;">New contact message</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px;">
                <p style="margin:0 0 20px;font-size:14px;color:#667067;">A message came through the contact form.</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;line-height:1.6;">
                  <tr>
                    <td style="padding:8px 0;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#667067;width:110px;">Name</td>
                    <td style="padding:8px 0;color:#1f2922;">${escapedName}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#667067;width:110px;">Email</td>
                    <td style="padding:8px 0;color:#1f2922;">${escapedEmail}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#667067;width:110px;">Topic</td>
                    <td style="padding:8px 0;color:#1f2922;">${escapedTopic}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#667067;width:110px;">Submitted</td>
                    <td style="padding:8px 0;color:#1f2922;">${submittedAt}</td>
                  </tr>
                </table>
                <div style="margin-top:24px;padding:18px 20px;background:#f6f4ed;border-left:3px solid #e77c60;font-size:15px;line-height:1.6;color:#1f2922;">
                  ${escapedMessage}
                </div>
                <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#667067;">Reply directly to this email to respond to ${escapedName}.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

    return { text, html, topicLabel, submittedAt };
}

export async function POST(request: Request) {
    if (!request.headers.get('content-type')?.includes('application/json')) {
        return jsonResponse({ error: 'Invalid request.' }, 415);
    }

    const contentLength = Number(request.headers.get('content-length') ?? 0);
    if (contentLength > MAX_REQUESTS_BYTES) {
        return jsonResponse({ error: 'Your message is too large.' }, 413);
    }

    if (!isSameOrigin(request)) {
        return jsonResponse({ error: 'Invalid request origin.' }, 403);
    }

    let rawBody: unknown;
    try {
        rawBody = await request.json();
    } catch {
        return jsonResponse({ error: 'Invalid request.' }, 400);
    }

    if (typeof rawBody !== 'object' || rawBody === null) {
        return jsonResponse({ error: 'Invalid request.' }, 400);
    }

    const body = rawBody as Record<string, unknown>;
    const elapsedMs = Number(body.elapsedMs);
    const payload: ContactPayload = {
        name: readString(body.name).trim(),
        email: readString(body.email).trim(),
        topic: readString(body.topic).trim(),
        message: readString(body.message).trim(),
        website: readString(body.website),
    };

    if (
        payload.name.length < MIN_NAME_LENGTH ||
        payload.name.length > MAX_NAME_LENGTH
    ) {
        return jsonResponse({ error: 'Please enter your name.' }, 400);
    }

    if (
        payload.email.length > MAX_EMAIL_LENGTH ||
        !EMAIL_PATTERN.test(payload.email)
    ) {
        return jsonResponse(
            { error: 'Please enter a valid email address.' },
            400,
        );
    }

    if (!isContactTopic(payload.topic)) {
        return jsonResponse({ error: 'Please choose a topic.' }, 400);
    }

    if (
        payload.message.length < MIN_MESSAGE_LENGTH ||
        payload.message.length > MAX_MESSAGE_LENGTH
    ) {
        return jsonResponse(
            {
                error: `Please write a message between ${MIN_MESSAGE_LENGTH} and ${MAX_MESSAGE_LENGTH} characters.`,
            },
            400,
        );
    }

    // Honeypot field: real visitors never see or fill this input.
    if (payload.website.length > 0) {
        return jsonResponse(
            { error: 'Your message was flagged as spam.' },
            400,
        );
    }

    // Naive bots submit forms almost immediately after the page loads.
    if (!Number.isFinite(elapsedMs) || elapsedMs < MIN_FILL_TIME_MS) {
        return jsonResponse(
            { error: 'Please take a moment and try again.' },
            400,
        );
    }

    const linkCount =
        payload.message.match(/(?:https?:\/\/|www\.)/gi)?.length ?? 0;
    if (linkCount > MAX_LINKS_IN_MESSAGE) {
        return jsonResponse(
            { error: 'Your message was flagged as spam.' },
            400,
        );
    }

    const destination =
        process.env.CONTACT_EMAIL?.trim() || 'hello@crochetpeakz.tech';
    const sender =
        process.env.CONTACT_FROM_EMAIL?.trim() ||
        process.env.RESEND_FROM_EMAIL?.trim() ||
        'Crochet PeakZ <hello@crochetpeakz.tech>';

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.error('[contact] RESEND_API_KEY is not configured.');
        return jsonResponse(
            {
                error: `The contact form is not configured yet. Please email ${destination} directly.`,
            },
            500,
        );
    }

    const ip = getClientIp(request.headers);
    const rateLimit = await checkContactRateLimit(ip);

    if (!rateLimit.allowed) {
        const minutes = Math.max(
            1,
            Math.ceil(rateLimit.retryAfterSeconds / 60),
        );

        return jsonResponse(
            {
                error: `Please wait about ${minutes} ${
                    minutes === 1 ? 'minute' : 'minutes'
                } before sending another message.`,
                retryAfterSeconds: rateLimit.retryAfterSeconds,
            },
            429,
            { 'Retry-After': String(rateLimit.retryAfterSeconds) },
        );
    }

    const { text, html, topicLabel, submittedAt } =
        buildEmailContent(payload);
    const subject = `New contact message: ${topicLabel} (${payload.name.replace(
        /[\r\n]+/g,
        ' ',
    )})`;

    try {
        const resend = new Resend(apiKey);
        const { error } = await resend.emails.send({
            from: sender,
            to: destination,
            replyTo: payload.email,
            subject,
            text,
            html,
            headers: {
                'X-Contact-Form-Submitted-At': submittedAt,
            },
        });

        if (error) {
            console.error(
                '[contact] Resend rejected the message:',
                error.name,
                error.message,
            );
            await clearContactRateLimit(ip);

            return jsonResponse(
                {
                    error: 'We could not send your message right now. Please try again in a moment.',
                },
                502,
            );
        }
    } catch (error) {
        console.error('[contact] Resend request failed.', error);
        await clearContactRateLimit(ip);

        return jsonResponse(
            {
                error: 'We could not send your message right now. Please try again in a moment.',
            },
            502,
        );
    }

    return jsonResponse({ ok: true });
}
