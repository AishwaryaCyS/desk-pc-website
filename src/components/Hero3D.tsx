'use client'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
// Loaded only in the browser, after the text and buttons have rendered.
const Desk3D = dynamic(() => import('./Desk3D'), { ssr: false })
export default function Hero3D() {
  const box = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(false)
  const [seen, setSeen] = useState(true)
  const [feet, setFeet] = useState(5)
  useEffect(() => {
    setOn(!matchMedia('(prefers-reduced-motion: reduce)').matches)
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting))
    if (box.current) io.observe(box.current)
    return () => io.disconnect() // stops drawing when scrolled out of view
  }, [])
  return (
    <div>
      <div ref={box} className="h-[380px] overflow-hidden rounded-3xl bg-panel md:h-[540px]" aria-label="3D preview of the Desk PC">
        {on ? <Desk3D feet={feet} active={seen} /> : <img src="/media/desk-rgb.jpg" alt="Desk PC with RGB fans under a glass top" className="h-full w-full object-cover" />}
      </div>
      <div className="mt-3 flex items-center justify-between text-sm text-mute">
        <span>Preview model. Drag to rotate.</span>
        <span className="flex gap-2">{[3, 4, 5, 6].map((n) => (
          <button key={n} onClick={() => setFeet(n)} aria-pressed={feet === n}
            className={`rounded-full px-3 py-1 ${feet === n ? 'bg-hot text-ink' : 'border border-white/20'}`}>{n} ft</button>
        ))}</span>
      </div>
    </div>
  )
}
