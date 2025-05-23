export type ExiconEntry = {
  title: string
  tags: string[]
  text: string
}

export type LexiconEntry = {
  title: string
  text: string
}

export type QSourceArticle = {
  title: string
  articleUrl: string
  featuredImageUrl: string
  quadrant: "foundations" | "get right (q1)" | "live right (q2)" | "lead right (q3)" | "leave right (q4)"
  fullText: string
}

export type Region = {
  slug: string
  name: string
  city: string
  state: string
}

export type XiconItem = {
  id: string
  title: string
  text: string
  type: "exercise" | "term" | "article" | "region"
  tags?: string[]
  aliases?: string[]
  youtubeId?: string
  quadrant?: QSourceArticle["quadrant"]
  articleUrl?: string
  featuredImageUrl?: string
  slug?: string
  city?: string
  state?: string
}
