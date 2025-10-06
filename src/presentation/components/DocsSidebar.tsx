import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import clsx from 'clsx'

export type DocItem = { slug: string; title: string; order: number; hidden: boolean }
export type DocNode =
  | { type: 'node'; name: string; title: string; order: number; slug?: string; children: DocNode[] }
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
            'block rounded-md px-3 py-1.5 text-sm transition-colors',
            active 
              ? 'bg-primary/10 text-primary font-medium' 
              : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
          )}
        >
          {node.item.title}
        </Link>
      )
    }
    if (node.type === 'node') {
      if (node.name === '__root__') {
        return <div key="root">{node.children.map(ch => renderNode(ch, depth))}</div>
      }

      const active = current === node.slug

      return (
        <div key={node.name} className={clsx(depth > 0 && 'ml-4 border-l border-gray-200 pl-3')}>
          {node.slug ? (
            <Link
              to={`/docs/${node.slug}`}
              className={clsx(
                'block rounded-md px-3 py-2 text-sm font-semibold transition-colors',
                active 
                  ? 'bg-primary/10 text-primary border border-primary/20' 
                  : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
              )}
            >
              {node.title}
            </Link>
          ) : (
            <div className="mt-4 mb-2 px-3 py-1 text-sm font-bold text-gray-900 border-b border-gray-200">
              {node.title}
            </div>
          )}
          <div className="space-y-1 mt-2">
            {node.children.map(ch => renderNode(ch, depth + 1))}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <aside
      className={clsx(
        'shrink-0 border-r border-gray-200 p-4 overflow-y-auto',
        'fixed top-[64px] left-0 h-[calc(100vh-64px)] w-64 bg-background', // ← 固定化
        className
      )}
    >
      {tree.map(n => renderNode(n))}
    </aside>
  )
}
