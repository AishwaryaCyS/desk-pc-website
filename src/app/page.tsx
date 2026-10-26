import Hero3D from '@/components/Hero3D'
import Gallery from '@/components/Gallery'
import Shop from '@/components/Shop'
import { BRAND } from '@/lib/brand'
const WA = process.env.NEXT_PUBLIC_WHATSAPP

export default function Home() {
  return (
    <main>
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <span className="font-display text-xl tracking-wide">{BRAND}</span>
        <nav className="flex gap-5 text-sm"><a href="#range">Sizes</a><a href="#contact">Contact</a></nav>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-10 md:grid-cols-2">
        <div>
          {/* Draft headline: the owner must choose. Keep "Desk PC in India" in the title and this line for search. */}
          <h1 className="font-display text-5xl leading-[1.05] md:text-7xl">Your PC, built into your desk.</h1>
          <p className="mt-5 text-lg text-mute">Desk PC in India. Proudly designed and manufactured in our Pune facility.</p>
          <a href="#range" className="mt-8 inline-block rounded-full bg-hot px-7 py-3 font-medium text-ink">Get yours now</a>
        </div>
        <Hero3D />
      </section>

      <Gallery />
      <Shop />

      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-display text-3xl">Features</h2>
        <p className="mt-3 text-mute">TO FILL IN: the owner will send the features list. Add each as a title and one line.</p>
      </section>

      <section id="contact" className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-display text-3xl">Get in touch</h2>
        <a href={`https://wa.me/${WA}`} className="mt-5 inline-block rounded-full bg-ice px-6 py-3 font-medium text-ink">Chat on WhatsApp</a>
        {/* Put qr-chat.png and qr-group.png in /public. On phones, tapping the button is easier than scanning. */}
        <div className="mt-8 hidden gap-8 md:flex">
          <figure><img src="/qr-chat.png" alt="QR code to chat on WhatsApp" width={160} height={160} /><figcaption className="mt-2 text-sm text-mute">Chat with us</figcaption></figure>
          <figure><img src="/qr-group.png" alt="QR code to join the WhatsApp group" width={160} height={160} /><figcaption className="mt-2 text-sm text-mute">Join the group</figcaption></figure>
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-10 text-sm text-mute">
        <div className="mx-auto max-w-6xl">{BRAND} · Pune facility address: TO FILL IN · Social links: TO FILL IN · GSTIN: TO FILL IN</div>
      </footer>
    </main>
  )
}
