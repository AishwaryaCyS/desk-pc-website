# Desk PC Website

A website and ordering system for the **Desk PC**: a glass-top desk with a full gaming PC built into it, designed and manufactured in Pune, India, in 3, 4, 5 and 6 foot sizes.

**Status: work in progress.** The landing page, 3D hero, cart, checkout and admin page are written and run locally. The order flow has not yet been verified end to end, and order alerts and online payments are not set up. See [Status](#status).

<!-- Add a screenshot after your first good run:
![Desk PC hero](docs/hero.png)
-->

## What it does

- Landing page following the owner's structure: hero, size range, features, contact, footer.
- 3D hero (Three.js) showing the desk with fans and lighting that cycle through colours, with 3, 4, 5 and 6 ft length buttons. The model is a recreation made from boxes, not a scan of the real desk.
- Gallery section with two short clips of the real product.
- Cart and guest checkout. The server recalculates prices from its own product list, so the browser cannot change a price.
- Orders are saved to a database. The owner can view them at `/admin` and change their status.
- Optional Telegram message to the owner for every new order.

## Status

| Area | State |
| --- | --- |
| Landing page, 3D hero, gallery | Written, runs locally |
| Cart and checkout form | Written, not yet verified end to end |
| Order saved to database, `/admin` list and status change | Written, not yet verified end to end |
| Telegram order alerts | Written, needs a bot token and chat id |
| Online payments (Razorpay) | Not started |
| Customer emails, order tracking page | Not started |
| Policy pages (shipping, returns, warranty, privacy, terms) | Not started |
| Real product specs, features, address, GST details | Waiting on the owner (shown as `TO FILL IN`) |
| Rate limiting, duplicate-order protection | Not started |

## Tech stack

Next.js 14 (App Router) with TypeScript, Tailwind CSS, Three.js through React Three Fiber and drei, Prisma with SQLite, Zod for input validation.

## Getting started

Requires Node.js 18.17 or newer.

```bash
npm install
cp .env.example .env        # on Windows PowerShell: copy .env.example .env
npx prisma db push
npm run dev
```

Open http://localhost:3000. Orders appear at http://localhost:3000/admin (any username, the password from `ADMIN_PASSWORD`).

### Environment variables

Set these in `.env`. This file is ignored by Git and must never be committed.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Database location. Default `file:./dev.db` (SQLite) |
| `ADMIN_PASSWORD` | Password for the `/admin` page |
| `TELEGRAM_BOT_TOKEN` | Bot token from @BotFather, for order alerts |
| `TELEGRAM_CHAT_ID` | Chat that receives the alerts |
| `NEXT_PUBLIC_WHATSAPP` | WhatsApp number with country code, digits only |

## Project structure

```
prisma/schema.prisma       Order table
public/media/              Product clips and poster images (audio removed)
src/app/page.tsx           Landing page
src/app/api/orders/        Order endpoint: validate, re-price, save, alert
src/app/admin/             Order list and status updates
src/components/            Shop (cart and checkout), Hero3D, Desk3D, Gallery
src/lib/                   products.ts (sizes and prices), brand.ts, db.ts, notify.ts
src/middleware.ts          Password prompt for /admin
```

To change prices or products, edit `src/lib/products.ts`. To change the brand name, edit `src/lib/brand.ts`.

## Known limitations

- The admin page uses a single shared password. It is fine for local testing and a first launch, not for a larger team.
- Nothing yet stops the same order being submitted twice if the request is repeated outside the browser button.
- SQLite is for development. Use a hosted PostgreSQL database before deploying to a service like Vercel, because its filesystem does not keep a SQLite file.
- Pay on delivery and Confirm on WhatsApp are only recorded with the order. No payment is taken.

## Roadmap

1. Verify the full order flow and set up Telegram alerts.
2. Fill in real content from the owner: features, specs, dimensions, delivery, warranty, address.
3. Replace the placeholder 3D model with a modelled one and add clean product photos.
4. Online payments with server-side payment verification.
5. Order tracking page, customer emails, policy pages.
6. Move to PostgreSQL and deploy.

## Credits and media

The product clips in `public/media` show the owner's real product and belong to the business. Ask the owner before reusing them elsewhere.
