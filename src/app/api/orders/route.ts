import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { PRODUCTS, inr } from '@/lib/products'
import { notify } from '@/lib/notify'

const Body = z.object({
  name: z.string().trim().min(2), email: z.string().email(),
  phone: z.string().regex(/^[6-9]\d{9}$/), pincode: z.string().regex(/^\d{6}$/),
  address: z.string().trim().min(8), payMethod: z.enum(['COD', 'WHATSAPP']),
  items: z.array(z.object({ id: z.string(), qty: z.number().int().min(1).max(10) })).min(1),
})

export async function POST(req: Request) {
  const p = Body.safeParse(await req.json().catch(() => null))
  if (!p.success) return NextResponse.json({ error: 'Check the highlighted details: a 10-digit mobile number and 6-digit pincode are needed.' }, { status: 400 })
  const d = p.data
  let total = 0
  const lines: { id: string; name: string; qty: number; pricePaise: number }[] = []
  for (const i of d.items) {
    const pr = PRODUCTS.find((x) => x.id === i.id) // price comes from the server, never the browser
    if (!pr) return NextResponse.json({ error: 'Unknown product.' }, { status: 400 })
    total += pr.pricePaise * i.qty
    lines.push({ id: pr.id, name: pr.name, qty: i.qty, pricePaise: pr.pricePaise })
  }
  const code = 'DP-' + Math.random().toString(36).slice(2, 8).toUpperCase()
  await db.order.create({ data: { code, name: d.name, phone: d.phone, email: d.email, address: d.address,
    pincode: d.pincode, payMethod: d.payMethod, totalPaise: total, items: JSON.stringify(lines) } })
  await notify(`New order ${code}\n${lines.map((l) => `${l.qty} x ${l.name}`).join(', ')}\nTotal ${inr(total)} (${d.payMethod})\n${d.name}, ${d.phone}\n${d.address} ${d.pincode}`)
  return NextResponse.json({ code })
}
