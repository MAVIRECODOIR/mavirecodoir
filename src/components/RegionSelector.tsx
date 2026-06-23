"use client"

import { useRegion } from "@/providers/region"

export default function RegionSelector() {
  const { region, allRegions, setRegionById } = useRegion()

  if (allRegions.length === 0) return null

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-neutral-600">Region:</span>
      <select
        value={region?.id || ""}
        onChange={(e) => setRegionById(e.target.value)}
        className="border border-neutral-300 px-2 py-1 rounded text-sm bg-white cursor-pointer"
      >
        {allRegions.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name} ({r.currency_code.toUpperCase()})
          </option>
        ))}
      </select>
    </div>
  )
}
