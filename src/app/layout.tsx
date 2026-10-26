import type { Metadata } from 'next'
import { Bricolage_Grotesque, Figtree } from 'next/font/google'
import './globals.css'
const display = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-display' })
const body = Figtree({ subsets: ['latin'], variable: '--font-body' })
export const metadata: Metadata = {
  title: 'Desk PC in India | Designed and made in Pune',
  description: 'Desk PC: a desk with a PC built in, designed and manufactured in Pune. Choose from 3, 4, 5 or 6 foot sizes.',
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" className={`${display.variable} ${body.variable}`}><body>{children}</body></html>
}
