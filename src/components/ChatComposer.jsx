import { memo, useEffect, useRef, useState } from 'react'

export const ChatComposer = memo(function ChatComposer({ disabled, placeholder, onSend }) {
  const [text, setText] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (disabled) return
    const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (isDesktop) inputRef.current?.focus()
  }, [disabled])

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
    <form className="chat-app__composer-inner" onSubmit={submit}>
      <textarea
        ref={inputRef}
        className="chat-app__input"
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
      />
      <button
        type="submit"
        className="chat-app__send"
        disabled={disabled || !text.trim()}
        aria-label="Отправить"
      >
        ↑
      </button>
    </form>
  )
})
