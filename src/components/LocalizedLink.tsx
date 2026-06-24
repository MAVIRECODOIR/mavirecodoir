"use client"

import Link from "next/link"
import { useLocalizedPath } from "@/hooks/useLocalizedPath"

type Props = {
  href: string
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  ariaLabel?: string
  target?: string
  rel?: string
}

export default function LocalizedLink({ href, children, ariaLabel, onClick, onMouseEnter, onMouseLeave, className, style, target, rel }: Props) {
  const toLocalized = useLocalizedPath()
  return (
    <Link href={toLocalized(href)} aria-label={ariaLabel} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className={className} style={style} target={target} rel={rel}>
      {children}
    </Link>
  )
}
