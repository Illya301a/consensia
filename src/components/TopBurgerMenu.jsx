import { useEffect } from 'react'
import { createPortal } from 'react-dom'

export default function TopBurgerMenu({
  isOpen,
  onToggle,
  onClose,
  menuId = 'top-mobile-menu',
  openAriaLabel,
  closeAriaLabel,
  menuAriaLabel,
  main,
  children,
}) {
  useEffect(() => {
    if (!isOpen) return
    const prevOverflow = document.body.style.overflow
    const onKey = (ev) => {
      if (ev.key === 'Escape') onClose?.()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, onClose])

  return (
    <>
      <button
        type="button"
        className={`top__burger${isOpen ? ' top__burger--open' : ''}`}
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label={isOpen ? closeAriaLabel : openAriaLabel}
        onClick={onToggle}
      >
        <span className="top__burger-line" aria-hidden="true" />
        <span className="top__burger-line" aria-hidden="true" />
        <span className="top__burger-line" aria-hidden="true" />
      </button>
      {createPortal(
        <>
          <div
            className={`top__menu-backdrop${isOpen ? ' top__menu-backdrop--visible' : ''}`}
            aria-hidden="true"
            onClick={onClose}
          />

          <div
            id={menuId}
            className={`top__menu-panel${isOpen ? ' top__menu-panel--open' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label={menuAriaLabel}
          >
            {main ? <div className="top__menu-main">{main}</div> : null}
            {children}
          </div>
        </>,
        document.body
      )}
    </>
  )
}
