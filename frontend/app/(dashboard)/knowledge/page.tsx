"use client"

import { FormEvent, useState } from "react"
import { Search } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { buildApiUrl } from "@/lib/api"

type Source = { medicine_name?: string; section?: string; content?: string; source_id?: string; rxcui?: string; relevance_score?: number }

export default function KnowledgePage() {
  const [query, setQuery] = useState("")
  const [sources, setSources] = useState<Source[]>([])
  const [message, setMessage] = useState("Search the DailyMed/RxNorm knowledge base.")
  const [loading, setLoading] = useState(false)

  const search = async (event: FormEvent) => {
    event.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setMessage("")
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`${buildApiUrl("/v1/knowledge")}?medicine=${encodeURIComponent(query.trim())}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      const payload = await response.json().catch(() => null)
      if (!response.ok || !payload?.success) throw new Error(payload?.detail || payload?.error || "Knowledge search failed")
      const nextSources = payload.data?.sources || []
      setSources(nextSources)
      setMessage(nextSources.length ? `${nextSources.length} authoritative source sections found.` : "No authoritative source was found for this medicine.")
    } catch (error) {
      setSources([])
      setMessage(error instanceof Error ? error.message : "Knowledge search failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageHeader title="Medication Knowledge Search" description="Search retrieved DailyMed and RxNorm medicine information." />
      <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
        <Card><CardContent className="p-5"><form className="flex gap-2" onSubmit={search}><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a medicine name" /><Button type="submit" disabled={loading}><Search data-icon="inline-start" />{loading ? "Searching..." : "Search"}</Button></form></CardContent></Card>
        <p className="text-sm text-muted-foreground">{message}</p>
        {sources.map((source, index) => <Card key={`${source.source_id}-${index}`}><CardHeader><CardTitle className="text-base">{source.medicine_name || query} {source.section ? `· ${source.section}` : ""}</CardTitle><p className="text-xs text-muted-foreground">RxCUI: {source.rxcui || "Not available"} · Source: DailyMed</p></CardHeader><CardContent className="text-sm text-muted-foreground">{source.content || "No source text available."}</CardContent></Card>)}
      </main>
    </>
  )
}
