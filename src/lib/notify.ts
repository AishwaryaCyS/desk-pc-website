// Sends the owner a Telegram message. Never throws: a failed alert must not fail the order.
export async function notify(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN, chat = process.env.TELEGRAM_CHAT_ID
  if (!token || !chat) return console.warn('Telegram not configured: order saved, no alert sent')
  try {
    const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: chat, text }),
    })
    if (!r.ok) console.error('Telegram alert failed', r.status)
  } catch (e) { console.error('Telegram alert failed', e) }
}
