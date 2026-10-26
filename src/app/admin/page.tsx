import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { inr } from '@/lib/products'
export const dynamic = 'force-dynamic'
const STATUSES = ['PLACED', 'CONFIRMED', 'IN_PRODUCTION', 'QUALITY_CHECK', 'READY_TO_SHIP', 'SHIPPED', 'DELIVERED', 'CANCELLED']

async function setStatus(fd: FormData) {
  'use server'
  const status = String(fd.get('status'))
  if (!STATUSES.includes(status)) return
  await db.order.update({ where: { id: String(fd.get('id')) }, data: { status } })
  revalidatePath('/admin')
}

export default async function Admin() {
  const orders = await db.order.findMany({ orderBy: { createdAt: 'desc' } })
  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 font-display text-3xl">Orders ({orders.length})</h1>
      {orders.length === 0 && <p className="text-mute">No orders yet. New ones appear here and in Telegram.</p>}
      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o.id} className="rounded-xl bg-panel p-4">
            <div className="flex flex-wrap justify-between gap-2">
              <b>{o.code}</b><span>{inr(o.totalPaise)} · {o.payMethod}</span>
              <span className="text-mute">{o.createdAt.toLocaleString('en-IN')}</span>
            </div>
            <p className="mt-2 text-sm">{(JSON.parse(o.items) as { qty: number; name: string }[]).map((l) => `${l.qty} x ${l.name}`).join(', ')}</p>
            <p className="text-sm text-mute">{o.name} · {o.phone} · {o.email}<br />{o.address}, {o.pincode}</p>
            <form action={setStatus} className="mt-3 flex gap-2">
              <input type="hidden" name="id" value={o.id} />
              <select name="status" defaultValue={o.status} className="rounded bg-ink px-2 py-1">{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
              <button className="rounded bg-hot px-3 py-1 font-medium text-ink">Save status</button>
            </form>
          </div>
        ))}
      </div>
    </main>
  )
}
