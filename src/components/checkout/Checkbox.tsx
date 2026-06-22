"use client";

type CheckboxProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string | React.ReactNode
  id?: string
}

export default function Checkbox({ checked, onChange, label, id }: CheckboxProps) {
  return (
    <label htmlFor={id} style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer" }}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ width: "16px", height: "16px", accentColor: "#33383C", cursor: "pointer", flexShrink: 0, marginTop: "2px" }}
      />
      <span style={{ fontWeight: 400, fontFamily: "Hellix, ABCDiorIcons, arial, sans-serif", fontSize: "13px", color: "#33383C", lineHeight: "1.5" }}>{label}</span>
    </label>
  )
}
