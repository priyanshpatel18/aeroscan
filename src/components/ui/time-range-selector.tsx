"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

export interface TimeRange {
  value: string
  label: string
  minutes: number
}

const timeRanges: TimeRange[] = [
  { value: "1m", label: "1 minute", minutes: 1 },
  { value: "2m", label: "2 minutes", minutes: 2 },
  { value: "3m", label: "3 minutes", minutes: 3 },
  { value: "5m", label: "5 minutes", minutes: 5 },
  { value: "10m", label: "10 minutes", minutes: 10 },
  { value: "15m", label: "15 minutes", minutes: 15 },
  { value: "30m", label: "30 minutes", minutes: 30 },
  { value: "45m", label: "45 minutes", minutes: 45 },
  { value: "1h", label: "1 hour", minutes: 60 },
  { value: "2h", label: "2 hours", minutes: 120 },
  { value: "3h", label: "3 hours", minutes: 180 },
  { value: "4h", label: "4 hours", minutes: 240 },
  { value: "1d", label: "1 day", minutes: 1440 },
  { value: "1w", label: "1 week", minutes: 10080 },
  { value: "1M", label: "1 month", minutes: 43200 },
  { value: "3M", label: "3 months", minutes: 129600 },
  { value: "6M", label: "6 months", minutes: 259200 },
  { value: "1y", label: "12 months", minutes: 525600 },
]

const groupedRanges = {
  MINUTES: timeRanges.filter(range => range.minutes < 60),
  HOURS: timeRanges.filter(range => range.minutes >= 60 && range.minutes < 1440),
  DAYS: timeRanges.filter(range => range.minutes >= 1440),
}

interface TimeRangeSelectorProps {
  value?: string
  onValueChange?: (value: string) => void
  defaultValue?: string
}

export function TimeRangeSelector({
  value,
  onValueChange,
  defaultValue = "1d"
}: TimeRangeSelectorProps) {
  const [selectedValue, setSelectedValue] = React.useState(value || defaultValue)
  const [isOpen, setIsOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  const selectedRange = timeRanges.find(range => range.value === selectedValue)

  const handleSelect = (currentValue: string) => {
    setSelectedValue(currentValue)
    onValueChange?.(currentValue)
    setIsOpen(false)
  }

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-[140px] px-3 py-2 text-sm border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        {selectedRange?.label || "Select range..."}
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-[200px] bg-popover border border-border rounded-md shadow-lg z-50 max-h-[280px] overflow-y-auto">
          <div className="p-2">
            <div className="mb-2">
              <div className="text-xs font-medium text-muted-foreground mb-1 px-2 py-1">MINUTES</div>
              {groupedRanges.MINUTES.map((range) => (
                <button
                  key={range.value}
                  onClick={() => handleSelect(range.value)}
                  className={`w-full text-left px-2 py-1 text-sm rounded hover:bg-accent hover:text-accent-foreground ${selectedValue === range.value ? 'bg-accent text-accent-foreground' : ''
                    }`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            <div className="mb-2">
              <div className="text-xs font-medium text-muted-foreground mb-1 px-2 py-1">HOURS</div>
              {groupedRanges.HOURS.map((range) => (
                <button
                  key={range.value}
                  onClick={() => handleSelect(range.value)}
                  className={`w-full text-left px-2 py-1 text-sm rounded hover:bg-accent hover:text-accent-foreground ${selectedValue === range.value ? 'bg-accent text-accent-foreground' : ''
                    }`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            <div>
              <div className="text-xs font-medium text-muted-foreground mb-1 px-2 py-1">DAYS</div>
              {groupedRanges.DAYS.map((range) => (
                <button
                  key={range.value}
                  onClick={() => handleSelect(range.value)}
                  className={`w-full text-left px-2 py-1 text-sm rounded hover:bg-accent hover:text-accent-foreground ${selectedValue === range.value ? 'bg-accent text-accent-foreground' : ''
                    }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function getTimeRangeMinutes(value: string): number {
  const range = timeRanges.find(r => r.value === value)
  return range?.minutes || 1440
}
