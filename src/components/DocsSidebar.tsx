import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import clsx from 'clsx'

export type DocItem = { slug: string; title: string; order: number; hidden: boolean }
export type DocNode =
  | { type: 'node'; name: string; title: string; order: number; children: DocNode[] }
  | { type: 'item'; item: DocItem }

type Props = {
  tree: DocNode[]
  activeSlug?: string
  className?: string // ← 追加：親から幅/表示を制御する
}

export default function Sidebar({ tree, activeSlug, className }: Props) {
  const loc = useLocation()
  const current = activeSlug ?? loc.pathname.replace(/^\/docs\//, '')

  const renderNode = (node: DocNode, depth = 0): React.ReactNode => {
    if (node.type === 'item') {
      if (node.item.hidden) return null
      const to = `/docs/${node.item.slug}`
      const active = current === node.item.slug
      return (
        <Link
          key={node.item.slug}
          to={to}
          className={clsx(
            'block rounded px-2 py-1 text-sm',
            active ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
          )}
        >
          {node.item.title}
        </Link>
      )
    }
    if (node.type === 'node') {
      return (
        <div key={node.name} className={clsx(depth > 0 && 'ml-3')}>
          {node.name !== '__root__' && (
            <div className={clsx('mt-3 mb-1 text-sm font-semibold', depth === 0 ? 'text-gray-700' : 'text-gray-500')}>
              {node.title}
            </div>
          )}
          <div className="space-y-1">{node.children.map(ch => renderNode(ch, depth + 1))}</div>
        </div>
      )
    }
    return null
  }

  return (
    <aside
      className={clsx(
        // 幅は親で指定できるように基本幅は外す（最小だけ定義）
        'shrink-0 border-r border-gray-200 p-4 overflow-y-auto h-[calc(100vh-64px)]',
        className
      )}
    >
      {tree.map(n => renderNode(n))}
    </aside>
  )
}
