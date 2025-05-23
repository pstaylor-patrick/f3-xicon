"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { getFilteredXicons } from "@/lib/xicon"
import { useInView } from "react-intersection-observer"
import { Suspense } from "react"
import { XiconList } from "@/components/xicon-list"
import { XiconHeader } from "@/components/xicon-header"
import type { XiconEntry, XiconFilter } from "@/lib/xicon"

const ITEMS_PER_PAGE = 12

export default function XiconPage() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<"all" | "exercise" | "term" | "article">(
    (searchParams.get("kind") as any) || "all",
  )

  const [filter, setFilter] = useState<XiconFilter>({
    kind: activeTab === "all" ? undefined : activeTab,
    tags: searchParams.get("tags")?.split(",").filter(Boolean) || [],
    query: searchParams.get("q") || "",
    tagsOperator: (searchParams.get("tagsOperator") as "AND" | "OR") || "OR",
  })

  const [allResults, setAllResults] = useState<XiconEntry[]>([])
  const [displayedResults, setDisplayedResults] = useState<XiconEntry[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const { ref, inView } = useInView({
    threshold: 0,
  })

  // Update filter when URL params change
  useEffect(() => {
    const newFilter: XiconFilter = {
      kind: activeTab === "all" ? undefined : activeTab,
      tags: searchParams.get("tags")?.split(",").filter(Boolean) || [],
      query: searchParams.get("q") || "",
      tagsOperator: (searchParams.get("tagsOperator") as "AND" | "OR") || "OR",
    }

    setFilter(newFilter)
    setPage(1)

    // Get filtered results
    const results = getFilteredXicons(newFilter)
    setAllResults(results)
    setDisplayedResults(results.slice(0, ITEMS_PER_PAGE))
    setHasMore(results.length > ITEMS_PER_PAGE)
  }, [searchParams, activeTab])

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
    }, 500)
  }

  const handleTabChange = (value: string) => {
    const newTab = value as "all" | "exercise" | "term" | "article"
    setActiveTab(newTab)

    // Update URL
    const params = new URLSearchParams(searchParams.toString())

    if (newTab === "all") {
      params.delete("kind")
    } else {
      params.set("kind", newTab)
    }

    window.history.pushState({}, "", `/xicon?${params.toString()}`)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <XiconHeader />
      <Suspense fallback={<div className="mt-8 text-center">Loading...</div>}>
        <XiconList />
      </Suspense>
    </div>
  )
}
