import { memo, useCallback, useEffect, useRef, useState } from 'react'

export const ChatComposer = memo(function ChatComposer({ disabled, placeholder, onSend }) {
  const [text, setText] = useState('')
  const [expanded, setExpanded] = useState(false)
  const inputRef = useRef(null)
  const resizeRafRef = useRef(0)
  const maxHeightRef = useRef(0)
  const paragraphCount = String(text ?? '')
    .split('\n')
    .filter((line) => line.trim().length > 0).length
  const canToggleExpand = paragraphCount >= 3
  const showExpandButton = expanded || canToggleExpand

  const recalcMaxHeight = useCallback(() => {
    const el = inputRef.current
    if (!el) return
    const maxHeight = Number.parseFloat(window.getComputedStyle(el).maxHeight) || el.scrollHeight
    maxHeightRef.current = maxHeight
  }, [])

  const resizeInput = useCallback(() => {
    const el = inputRef.current
    if (!el) return
    const maxHeight = maxHeightRef.current || Number.parseFloat(window.getComputedStyle(el).maxHeight) || el.scrollHeight
    const nextHeight = Math.min(el.scrollHeight, maxHeight)
    const nextHeightPx = `${nextHeight}px`
    if (el.style.height !== nextHeightPx) {
      el.style.height = nextHeightPx
    }
    const nextOverflow = el.scrollHeight > maxHeight ? 'auto' : 'hidden'
    if (el.style.overflowY !== nextOverflow) {
      el.style.overflowY = nextOverflow
    }
  }, [])

  const scheduleResize = useCallback(() => {
    if (resizeRafRef.current) {
      window.cancelAnimationFrame(resizeRafRef.current)
    }
    resizeRafRef.current = window.requestAnimationFrame(() => {
      const el = inputRef.current
      if (!el) return
      el.style.height = 'auto'
      resizeInput()
    })
  }, [resizeInput])

  useEffect(() => {
    if (disabled) return
    const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (isDesktop) inputRef.current?.focus()
  }, [disabled])

  useEffect(() => {
    recalcMaxHeight()
    scheduleResize()
  }, [expanded, recalcMaxHeight, scheduleResize])

  useEffect(() => {
    scheduleResize()
  }, [text, scheduleResize])

  useEffect(() => {
    const onResize = () => {
      recalcMaxHeight()
      scheduleResize()
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      if (resizeRafRef.current) {
        window.cancelAnimationFrame(resizeRafRef.current)
      }
    }
  }, [recalcMaxHeight, scheduleResize])

  const submit = (e) => {
    e.preventDefault()
    const value = text.trim()
    if (!value || disabled) return
    onSend?.(value)
    setText('')
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit(e)
    }
  }

  return (
    <form
      className={`chat-app__composer-inner${expanded ? ' chat-app__composer-inner--expanded' : ''}`}
      onSubmit={submit}
    >
      <div className="chat-app__input-wrap">
        <textarea
          ref={inputRef}
          className={`chat-app__input${expanded ? ' chat-app__input--expanded' : ''}`}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>
      <div
        className={`chat-app__composer-actions${showExpandButton ? ' chat-app__composer-actions--with-expand' : ''}`}
      >
        {showExpandButton ? (
          <button
            type="button"
            className="chat-app__input-expand"
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? 'Свернуть поле ввода' : 'Развернуть поле ввода'}
            title={expanded ? 'Свернуть' : 'Развернуть'}
          >
            {expanded ? '⤡' : '⤢'}
          </button>
        ) : null}
        <button
          type="submit"
          className="chat-app__send"
          disabled={disabled || !text.trim()}
          aria-label="Отправить"
        >
          ↑
        </button>
      </div>
    </form>
  )
})
