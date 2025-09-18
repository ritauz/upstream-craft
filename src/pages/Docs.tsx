import React, { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MDXProvider } from '@mdx-js/react'
import Sidebar from '@/components/DocsSidebar'
import { mdxComponents } from '@/components/MdxComponents'
import { buildItems, buildDocTree, normalizeSlug, toPath } from '@/lib/docsNav'
import { Button } from '@/components/ui/button'
import { PanelLeftOpen, PanelLeftClose, FileSpreadsheet } from 'lucide-react'
import clsx from 'clsx'

// 本文（遅延）
const pageModules = import.meta.glob('/src/docs/**/*.mdx')
// メタ（即時）
const metaModules = import.meta.glob('/src/docs/**/*.mdx', { eager: true }) as Record<
  string,
  { meta?: { title?: string; order?: number; hidden?: boolean } }
>

export default function Docs() {
  const { '*': raw } = useParams() as { '*': string }
  const navigate = useNavigate()

  const hasIndex = (p: string) => !!metaModules[p]
  const slug = normalizeSlug(raw, hasIndex)
  const path = toPath(slug)

  const items = useMemo(() => buildItems(metaModules), [])
  const tree = useMemo(() => buildDocTree(items.filter(i => !i.hidden)), [items])

  const Mod = (pageModules as any)[path]
  const Lazy = React.useMemo(
    () =>
      React.lazy(async () => {
        if (!Mod) return { default: () => <div className="text-gray-500">ページが見つかりません</div> }
        const m = await Mod()
        return { default: m.default }
      }),
    [Mod]
  )

  // === Sidebar 折り畳み ===
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-card/60 backdrop-blur">
        <div className="px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            aria-label={sidebarOpen ? 'サイドバーを閉じる' : 'サイドバーを開く'}
            onClick={() => setSidebarOpen(v => !v)}
          >
            {sidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
          </Button>
          <h1 className="text-lg font-semibold tracking-tight">Docs</h1>
          <div className="ml-auto">
            <Button variant="outline" size="sm" onClick={() => navigate('/')}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              成果物一覧へ
            </Button>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex">
        {/* Sidebar - 折り畳み時は非表示（アニメ付き） */}
        <div
          className={clsx(
            'transition-all duration-200',
            sidebarOpen ? 'w-64' : 'w-0',
            // w-0 でも tab でフォーカスされないように visibility も制御
            sidebarOpen ? 'visible' : 'invisible'
          )}
        >
          {sidebarOpen && <Sidebar tree={tree} className="w-64" />}
        </div>

        {/* Main */}
        <main className="p-6 flex-1 min-w-0">
          <MDXProvider components={mdxComponents as any}>
            <React.Suspense fallback={<div>Loading...</div>}>
              <article className="prose prose-zinc dark:prose-invert max-w-none">
                <Lazy />
              </article>
            </React.Suspense>
          </MDXProvider>
        </main>
      </div>
    </div>
  )
}
