'use client'
import { useEffect, useRef } from 'react'
const CLIPS = [
  { src: '/media/desk-rgb.mp4', poster: '/media/desk-rgb.jpg', label: 'RGB mode cycling through colours' },
  { src: '/media/desk-red.mp4', poster: '/media/desk-red.jpg', label: 'Red mode with themed fans' },
]
function Clip({ src, poster, label }: (typeof CLIPS)[number]) {
  const r = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const v = r.current
    if (!v) return
    v.muted = true // autoplay only works muted; the files have no sound anyway
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) v.play().catch(() => {})
  }, [])
  return (
    <figure>
      <video ref={r} src={src} poster={poster} muted loop playsInline preload="metadata" aria-label={label} className="aspect-[9/16] w-full rounded-3xl bg-panel object-cover" />
      <figcaption className="mt-2 text-sm text-mute">{label}</figcaption>
    </figure>
  )
}
export default function Gallery() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <h2 className="font-display text-3xl md:text-4xl">See it light up</h2>
      <p className="mt-3 max-w-xl text-mute">A glass top with the whole PC visible underneath: fans, graphics card and edge lighting, running on the desk.</p>
      <div className="mt-8 grid max-w-2xl grid-cols-2 gap-4">{CLIPS.map((c) => <Clip key={c.src} {...c} />)}</div>
    </section>
  )
}
