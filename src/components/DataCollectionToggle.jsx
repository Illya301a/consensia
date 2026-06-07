export default function DataCollectionToggle({ checked, onChange, label }) {
  return (
    <div className="chat-app__toggle-row">
      <span className="chat-app__toggle-label">{label}</span>
      <label className="chat-app__toggle-control">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
        />
        <span className="chat-app__toggle-ui" aria-hidden="true" />
      </label>
    </div>
  )
}
