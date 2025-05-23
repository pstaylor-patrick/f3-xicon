"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { XiconCard } from "@/components/xicon-card"
import { getFilteredXicons } from "@/lib/xicon"
import { useInView } from "react-intersection-observer"
import { Loader2 } from "lucide-react"
import type { XiconEntry, XiconFilter } from "@/lib/xicon"

const ITEMS_PER_PAGE = 12

export function XiconList() {
  const searchParams = useSearchParams()
  const [allResults, setAllResults] = useState<XiconEntry[]>([])
  const [displayedResults, setDisplayedResults] = useState<XiconEntry[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)

  const { ref, inView } = useInView({
    threshold: 0,
  })

  // Update results when URL params change
  useEffect(() => {
    const filter: XiconFilter = {
      kind: (searchParams.get("kind") as any) || undefined,
      tags: searchParams.get("tags")?.split(",").filter(Boolean) || [],
      query: searchParams.get("q") || "",
      tagsOperator: (searchParams.get("tagsOperator") as "AND" | "OR") || "OR",
    }

    setPage(1)
    setLoading(true)

    // Get filtered results
    const results = getFilteredXicons(filter)
    setAllResults(results)
    setDisplayedResults(results.slice(0, ITEMS_PER_PAGE))
    setHasMore(results.length > ITEMS_PER_PAGE)
    setLoading(false)
  }, [searchParams])

  // Load more results when scrolling to the bottom
  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMore()
    }
  }, [inView])

  const loadMore = () => {
    setLoading(true)

    // Simulate loading delay
    setTimeout(() => {
      const nextPage = page + 1
      const nextResults = allResults.slice(0, nextPage * ITEMS_PER_PAGE)

      setDisplayedResults(nextResults)
      setPage(nextPage)
      setHasMore(nextResults.length < allResults.length)
      setLoading(false)
    }, 300)
  }

  if (loading && displayedResults.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (displayedResults.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg font-medium">No results found</p>
        <p className="mt-2 text-gray-500">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {displayedResults.map((entry) => (
          <XiconCard key={entry.id} entry={entry} />
        ))}
      </div>

      {hasMore && (
        <div ref={ref} className="flex items-center justify-center py-8">
          {loading && <Loader2 className="h-6 w-6 animate-spin text-primary" />}
        </div>
      )}
    </div>
  )
}
