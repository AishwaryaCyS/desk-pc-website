'use client'
import { useState } from 'react'
import { PRODUCTS, inr } from '@/lib/products'
const WA = process.env.NEXT_PUBLIC_WHATSAPP
const inp = 'w-full rounded-lg border border-white/15 bg-ink px-3 py-2'

export default function Shop() {
  const [cart, setCart] = useState<Record<string, number>>({})
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [code, setCode] = useState('')
  const items = PRODUCTS.filter((p) => cart[p.id])
  const count = items.reduce((s, p) => s + cart[p.id], 0)
  const total = items.reduce((s, p) => s + p.pricePaise * cart[p.id], 0)
  const add = (id: string, d: number) => setCart((c) => {
    const n = { ...c }, q = (c[id] || 0) + d
    if (q <= 0) delete n[id]; else n[id] = Math.min(q, 10)
    return n
  })

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (busy) return // blocks double clicks
    setBusy(true); setErr('')
    const f = Object.fromEntries(new FormData(e.currentTarget))
    const r = await fetch('/api/orders', { method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...f, items: items.map((p) => ({ id: p.id, qty: cart[p.id] })) }) }).catch(() => null)
    const j = await r?.json().catch(() => null)
    setBusy(false)
    if (r?.ok && j?.code) { setCode(j.code); setCart({}) }
    else setErr(j?.error || 'Could not place the order. Check your connection and try again.')
  }

  return (
    <section id="range" className="mx-auto max-w-6xl px-5 py-20">
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-display text-4xl md:text-5xl">Choose your size</h2>
        <button onClick={() => setOpen(true)} className="rounded-full bg-hot px-5 py-2 font-medium text-ink">Cart ({count})</button>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {PRODUCTS.map((p, i) => (
          <article key={p.id} className={`rounded-3xl bg-panel p-6 ${i === 3 ? 'md:translate-y-6' : ''}`}>
            <h3 className="font-display text-2xl">{p.name}</h3>
            <p className="mt-1 text-3xl font-semibold text-ice">{inr(p.pricePaise)}</p>
            <p className="mt-3 text-sm text-mute">{p.blurb}</p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => { add(p.id, 1); setOpen(true) }} className="rounded-full bg-hot px-5 py-2 font-medium text-ink">Add to cart</button>
              <a href={`https://wa.me/${WA}?text=${encodeURIComponent(`Hi, I'm interested in the ${p.name} (${inr(p.pricePaise)}).`)}`}
                className="rounded-full border border-white/25 px-5 py-2">Enquire on WhatsApp</a>
            </div>
          </article>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60" onClick={() => setOpen(false)}>
          <aside role="dialog" aria-label="Cart" onClick={(e) => e.stopPropagation()} className="h-full w-full max-w-md overflow-y-auto bg-panel p-6">
            <div className="flex justify-between"><h3 className="font-display text-2xl">Your order</h3><button onClick={() => setOpen(false)}>Close</button></div>
            {code ? (
              <p className="mt-8">Order <b>{code}</b> is placed. We will call or WhatsApp you to confirm delivery and payment. Keep this order ID.</p>
            ) : items.length === 0 ? (
              <p className="mt-8 text-mute">Your cart is empty. Pick a size to start.</p>
            ) : (
              <form onSubmit={submit} className="mt-6 space-y-3">
                {items.map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-2">
                    <span>{p.name}</span>
                    <span className="flex items-center gap-2">
                      <button type="button" aria-label="Remove one" onClick={() => add(p.id, -1)}>−</button>{cart[p.id]}
                      <button type="button" aria-label="Add one" onClick={() => add(p.id, 1)}>+</button>
                    </span>
                  </div>
                ))}
                <p className="border-t border-white/10 pt-3 text-lg">Total {inr(total)} <span className="text-sm text-mute">(delivery and GST: TO FILL IN)</span></p>
                <input name="name" required placeholder="Full name" className={inp} />
                <input name="phone" required inputMode="numeric" placeholder="10-digit mobile number" className={inp} />
                <input name="email" required type="email" placeholder="Email" className={inp} />
                <textarea name="address" required placeholder="Full delivery address" rows={3} className={inp} />
                <input name="pincode" required inputMode="numeric" placeholder="6-digit pincode" className={inp} />
                <select name="payMethod" className={inp}>
                  <option value="WHATSAPP">Confirm on WhatsApp first</option>
                  <option value="COD">Pay on delivery</option>
                </select>
                {err && <p role="alert" className="text-hot">{err}</p>}
                <button disabled={busy} className="w-full rounded-full bg-hot py-3 font-medium text-ink disabled:opacity-50">{busy ? 'Placing order…' : 'Place order'}</button>
              </form>
            )}
          </aside>
        </div>
      )}
    </section>
  )
}
