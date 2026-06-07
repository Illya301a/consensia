import { useEffect, useLayoutEffect, useRef, useState } from 'react'

const TOP_ISLAND_ON_PX = 72
const TOP_ISLAND_OFF_PX = 36

function readHeight(el) {
  return el?.offsetHeight ?? 0
}

export function useTopIslandScroll(headerRef) {
  const [topIsland, setTopIsland] = useState(false)
  const [topSlotHeight, setTopSlotHeight] = useState(0)
  const topIslandRef = useRef(false)

  useEffect(() => {
    topIslandRef.current = topIsland
  }, [topIsland])

  useEffect(() => {
    let raf = 0

    const onScroll = () => {
      if (raf) return
      raf = window.requestAnimationFrame(() => {
        raf = 0
        const y = window.scrollY
        const prev = topIslandRef.current
        let next = prev

        if (!prev && y > TOP_ISLAND_ON_PX) {
          next = true
          const h = readHeight(headerRef.current)
          if (h > 0) {
            setTopSlotHeight((slotH) => (slotH === h ? slotH : h))
          }
        } else if (prev && y < TOP_ISLAND_OFF_PX) {
          next = false
        }

        if (next === prev) return

        topIslandRef.current = next
        setTopIsland(next)
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [headerRef])

  useLayoutEffect(() => {
    const el = headerRef.current
    if (!el || topIsland) return undefined

    const syncHeight = () => {
      const h = readHeight(el)
      if (h > 0) {
        setTopSlotHeight((prev) => (prev === h ? prev : h))
      }
    }

    syncHeight()
    const ro = new ResizeObserver(syncHeight)
    ro.observe(el)
    return () => ro.disconnect()
  }, [topIsland, headerRef])

  return { topIsland, topSlotHeight }
}
