'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PROMPT_CATEGORIES } from '@/config/constants'

export function GalleryFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(
    searchParams.get('search') ?? '',
  )
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value && value !== 'all') {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete('page')
      router.push(`/gallery?${params.toString()}`)
    },
    [router, searchParams],
  )

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      updateParam('search', searchValue)
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [searchValue, updateParam])

  return (
    <div className="paper-edge bg-card flex flex-col gap-4 p-4 sm:flex-row sm:items-end">
      <div className="min-w-0 flex-1">
        <p className="text-muted-foreground font-mono text-[10px] font-medium tracking-[0.24em] uppercase">
          Find inspiration
        </p>
        <div className="relative mt-2">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search public prompts…"
            className="border-foreground/85 bg-background h-11 rounded-sm pl-9 shadow-[var(--shadow-paper-sm)] transition-[transform,box-shadow] focus-visible:-translate-y-px focus-visible:shadow-[var(--shadow-paper)]"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>
      <div className="sm:w-52">
        <p className="text-muted-foreground font-mono text-[10px] font-medium tracking-[0.24em] uppercase">
          Category
        </p>
        <Select
          defaultValue={searchParams.get('category') ?? 'all'}
          onValueChange={(value) => updateParam('category', value ?? 'all')}
        >
          <SelectTrigger className="border-foreground/85 bg-background mt-2 h-11 w-full rounded-sm shadow-[var(--shadow-paper-sm)]">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {PROMPT_CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
