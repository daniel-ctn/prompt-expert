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

export function PromptFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(
    searchParams.get('search') ?? '',
  )
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)
  const isInitialMount = useRef(true)

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value && value !== 'all') {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete('page')
      router.push(`/prompts?${params.toString()}`)
    },
    [router, searchParams],
  )

  useEffect(() => {
    // Skip the initial mount to avoid triggering on first render
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const currentSearch = searchParams.get('search') ?? ''
      // Only push if the value actually changed from what's in the URL
      if (searchValue !== currentSearch) {
        updateParam('search', searchValue)
      }
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue])

  return (
    <div className="page-frame flex flex-col gap-4 rounded-[calc(var(--radius-3xl)+2px)] p-4 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <p className="section-label">Search library</p>
        <div className="relative mt-2">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search prompts..."
            className="border-border/70 bg-background/84 h-11 rounded-full pl-9"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>
      <div className="sm:w-52">
        <p className="section-label">Category</p>
        <Select
          defaultValue={searchParams.get('category') ?? 'all'}
          onValueChange={(value) => updateParam('category', value ?? 'all')}
        >
          <SelectTrigger className="border-border/70 bg-background/84 mt-2 h-11 w-full rounded-full">
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
