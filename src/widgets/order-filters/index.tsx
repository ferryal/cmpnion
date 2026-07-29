import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ALL_ORDER_STATUSES,
  ALL_PAYMENT_STATUSES,
  ALL_SERVICE_TYPES,
  STATUS_LABELS,
} from '@entities/order'
import { useOrderFilters } from '@features/filter-orders/model/useOrderFilters'
import { ArrowUpDown, Search, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

function FilterSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T | undefined
  options: { value: T | 'All'; label: string }[]
  onChange: (value: T | 'All') => void
}) {
  const selectValue = value ?? 'All'
  return (
    <div className="flex flex-col gap-1.5 min-w-[140px]">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <Select value={selectValue} onValueChange={onChange}>
        <SelectTrigger className="h-9 text-xs">
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All" className="text-xs">
            All
          </SelectItem>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value} className="text-xs">
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export function FilterBar() {
  const { filters, setFilter, clearAll, activeCount } = useOrderFilters()
  const [showFilters, setShowFilters] = useState(false)
  const [searchInput, setSearchInput] = useState(filters.q ?? '')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Sync state if filters change externally (e.g. from deep links)
  useEffect(() => {
    setSearchInput(filters.q ?? '')
  }, [filters.q])

  const handleSearch = (value: string) => {
    setSearchInput(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setFilter('q', value || undefined)
    }, 300)
  }

  const clearSearch = () => {
    setSearchInput('')
    setFilter('q', undefined)
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search guest name, room, order ID..."
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 pr-8 text-xs h-9 bg-background focus-visible:ring-1 focus-visible:ring-ring"
          />
          {searchInput && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={clearSearch}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        {/* Filters toggle button */}
        <Button
          type="button"
          variant={showFilters || activeCount > 0 ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowFilters((v) => !v)}
          className="h-9 gap-1.5 text-xs"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
          {activeCount > 0 && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-foreground/20 px-1 text-[10px] font-semibold">
              {activeCount}
            </span>
          )}
        </Button>

        {/* Sort button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setFilter('sort', filters.sort === 'newest' ? 'oldest' : 'newest')}
          className="h-9 gap-1.5 text-xs text-foreground bg-background"
        >
          <ArrowUpDown className="h-3.5 w-3.5" />
          {filters.sort === 'oldest' ? 'Oldest first' : 'Newest first'}
        </Button>

        {activeCount > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="h-9 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="flex flex-wrap gap-4 rounded-lg border border-border bg-muted/20 p-4 animate-fade-in">
          <FilterSelect
            label="Status"
            value={filters.status}
            options={ALL_ORDER_STATUSES.map((s) => ({ value: s, label: STATUS_LABELS[s] }))}
            onChange={(v) => setFilter('status', v === 'All' ? undefined : (v as never))}
          />
          <FilterSelect
            label="Service requested"
            value={filters.service}
            options={ALL_SERVICE_TYPES.map((s) => ({ value: s, label: s }))}
            onChange={(v) => setFilter('service', v === 'All' ? undefined : (v as never))}
          />
          <FilterSelect
            label="Payment status"
            value={filters.paymentStatus}
            options={ALL_PAYMENT_STATUSES.map((s) => ({ value: s, label: s }))}
            onChange={(v) => setFilter('paymentStatus', v === 'All' ? undefined : (v as never))}
          />
        </div>
      )}
    </div>
  )
}
