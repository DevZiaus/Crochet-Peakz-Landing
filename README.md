# Crochet PeakZ

The Crochet PeakZ marketing site is a warm, responsive Next.js landing page for handmade crochet pieces, patterns, and future shop updates.

## Features

- Responsive landing page with handmade brand styling
- Story, store, contact, privacy, and data-deletion pages
- Responsive navigation and shared site header/footer
- Open Graph metadata with a production `metadataBase`
- Optional Meta Pixel integration
- Static image assets served from `public/images`

## Tech stack

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind CSS and custom CSS
- Radix UI components
- Lucide icons
- Resend for contact form email delivery
- Upstash Redis / Vercel KV (optional) for distributed rate limiting
- ESLint 9 with the Next.js flat configuration
- Vercel deployment

## Requirements

- Node.js 20.9 or newer
- npm

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a local environment file:

   ```bash
   cp .env.local.example .env.local
   ```

3. Update `.env.local` with the values for your environment.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical public URL used for metadata. Defaults to `https://crochetpeakz.tech`. |
| `NEXT_PUBLIC_META_PIXEL_ID` | No | Meta Pixel ID. Leave blank to disable tracking. |
| `RESEND_API_KEY` | Yes, for the contact form | Resend API key used by `/api/contact` to send messages. |
| `CONTACT_EMAIL` | No | Destination address for contact messages. Defaults to `hello@crochetpeakz.tech`. |
| `CONTACT_FROM_EMAIL` | No | Verified Resend sender. Defaults to `Crochet PeakZ <hello@crochetpeakz.tech>`. `RESEND_FROM_EMAIL` is accepted as a fallback. |
| `UPSTASH_REDIS_REST_URL` | No | Upstash Redis REST URL. Recommended on Vercel so rate limits are shared across instances. |
| `UPSTASH_REDIS_REST_TOKEN` | No | Upstash Redis REST token. Recommended on Vercel. |

Variables beginning with `NEXT_PUBLIC_` are exposed to the browser. Do not put private credentials in them. Keep `RESEND_API_KEY`, `CONTACT_EMAIL`, and the Upstash/Vercel KV credentials in `.env.local` or the Vercel project settings.

The rate limiter also accepts Vercel KV's `KV_REST_API_URL` and `KV_REST_API_TOKEN` variables.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create an optimized production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | Run TypeScript checks |
| `npm run lint` | Run ESLint |

## Routes

| Path | Purpose |
| --- | --- |
| `/` | Homepage and brand introduction |
| `/about` | Crochet PeakZ story |
| `/store` | Coming-soon shop page |
| `/contact` | Contact form and contact details |
| `/privacy` | Privacy policy |
| `/data-deletion` | Data deletion instructions |

## Project structure

```text
app/                 App Router pages, layout, and global styles
components/          Shared site components and UI primitives
hooks/               Reusable React hooks
lib/                 Shared utilities
public/images/       Static image assets
.env.local.example   Environment variable template
```

## Contact form

Submissions are posted to `/api/contact` and delivered with [Resend](https://resend.com). By default, messages are sent to `hello@crochetpeakz.tech` with the visitor's address set as `Reply-To`.

To enable delivery:

1. Verify the `crochetpeakz.tech` domain in Resend.
2. Create a Resend API key.
3. Set `RESEND_API_KEY` in `.env.local` or the Vercel project settings. Optionally override `CONTACT_EMAIL` and `CONTACT_FROM_EMAIL`.
4. Redeploy so the server picks up the new variables.

The form includes layered spam protection:

- A hidden honeypot field that must remain empty
- A minimum three-second fill time
- A limit of three links per message
- Same-origin request checks
- Validation and length limits on every field

Submissions are limited to one per IP address every 30 minutes. Configure `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (or the Vercel KV equivalents) for a limit shared across serverless instances. Without those variables, the project uses an in-memory fallback, which works in local development but is not reliable across multiple production instances.

The visitor's IP is hashed before it is used as a rate-limit key, and failed email sends clear the rate-limit entry so the visitor can retry.

## Deployment

The project deploys to Vercel through GitHub Actions using the project credentials stored in repository secrets. Vercel Git integration is not required. If you set up a new Vercel project, select the project root and use the default Next.js settings:

```text
Framework preset: Next.js
Build command: next build
Output directory: .next
```

Vercel detects the build command and output directory automatically. Add the variables from `.env.local.example` in the Vercel project settings before deploying. Set `NEXT_PUBLIC_SITE_URL` to the production URL so canonical and social metadata use the deployed domain.

Run the production checks locally with:

```bash
npm run typecheck
npm run build
```

### GitHub Actions deployment

The [Vercel workflow](./.github/workflows/vercel.yml) validates every push and pull request with linting, typechecking, and a production build. When changes are pushed to `main`, it deploys to production with the Vercel CLI, aliases the deployment to `crochetpeakz.tech`, and verifies that the live domain returns HTTP 200. Pull requests run validation only.

Add these GitHub repository secrets before enabling deployment:

| Secret | Description |
| --- | --- |
| `VERCEL_TOKEN` | Vercel access token |
| `VERCEL_ORG_ID` | Vercel team or account ID |
| `VERCEL_PROJECT_ID` | Vercel project ID |

Pull requests from forks still run validation but do not deploy, so protected Vercel secrets are not exposed.
