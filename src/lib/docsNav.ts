import type { DocItem, DocNode } from '@/components/DocsSidebar'

// === helpers ===
export const toSlug = (p: string) => p.replace('/src/docs/', '').replace(/\.mdx$/, '')
export const toPath = (slug: string) => `/src/docs/${slug}.mdx`
export const humanize = (s: string) =>
  s.replace(/(^|[-_])([a-z])/g, (_, __, c) => ' ' + c.toUpperCase()).trim()

export const normalizeSlug = (
  raw: string | undefined,
  hasIndex: (candidatePath: string) => boolean
) => {
  let s = (raw || 'index').replace(/^\//, '').replace(/\/+$/, '')
  if (!s) s = 'index'
  const asDirIndex = (x: string) => `${x}/index`
  if (!s.includes('/')) {
    if (hasIndex(`/src/docs/${s}/index.mdx`)) return asDirIndex(s)
    return s // 単独ファイルも許容（例: intro.mdx）
  }
  if (hasIndex(`/src/docs/${s}/index.mdx`)) return asDirIndex(s)
  return s
}

// メタ→DocItem（並びルールはここで完結：差し替え可能）
export const buildItems = (metaModules: Record<string, { meta?: { title?: string; order?: number; hidden?: boolean } }>): DocItem[] => {
  const items = Object.entries(metaModules).map(([p, m]) => {
    const slug = toSlug(p)
    const segs = slug.split('/')
    const file = segs[segs.length - 1]
    const meta = m.meta || {}
    const title = meta.title || (file === 'index' ? humanize(segs[segs.length - 2] || 'Index') : humanize(file))
    return { slug, title, order: meta.order ?? 99, hidden: !!meta.hidden }
  })

  // 既定の並び：同階層 order → title。任意で intro を最上位にしたい場合はここで調整
  return items.sort((a, b) => {
    const aDir = a.slug.split('/').slice(0, -1).join('/')
    const bDir = b.slug.split('/').slice(0, -1).join('/')
    if (aDir === bDir) {
      if (a.order !== b.order) return a.order - b.order
      return a.title.localeCompare(b.title, 'ja')
    }
    return a.slug.localeCompare(b.slug, 'ja')
  })
}

// DocItem[] → ツリー
export const buildDocTree = (items: DocItem[]): DocNode[] => {
  const ensureNode = (name: string, title?: string, order = 50): DocNode => ({
    type: 'node',
    name,
    title: title ?? name,
    order,
    children: [],
  })

  const roots: Record<string, DocNode> = {}

  const getOrCreateChildNode = (parent: DocNode, name: string, title?: string, order = 50) => {
    if (parent.type === 'node') {
      const existing = parent.children.find(
        n => n.type === 'node' && (n as any).name === name
      ) as DocNode | undefined
      if (existing) return existing
    }
    const created = ensureNode(name, title, order)
    if (parent.type === 'node') parent.children.push(created)
    return created
  }

  const getRoot = (name: string, title?: string, order = 50) => {
    if (!roots[name]) roots[name] = ensureNode(name, title, order)
    return roots[name]
  }

  items.forEach(item => {
    const segs = item.slug.split('/')

    if (segs.length === 1) {
      // /intro.mdx のようなルート直下
      const r = getRoot('__root__', 'Docs', 0)
      if (r.type === 'node') r.children.push({ type: 'item', item })
      return
    }

    let parent = getRoot(segs[0])
    for (let i = 1; i < segs.length - 1; i++) {
      parent = getOrCreateChildNode(parent, segs[i])
    }

    // フォルダ直下の index.mdx
    if (segs[segs.length - 1] === 'index') {
      if (parent.type === 'node') {
        parent.title = item.title
        parent.order = item.order
        parent.slug = item.slug.replace(/\/index$/, '') // ← ノード自身のリンク先
      }
      return
    }

    if (parent.type === 'node') {
      parent.children.push({ type: 'item', item })
    }
  })

  const getOrder = (n: DocNode) =>
    n.type === 'item' ? n.item.order : (n as any).order ?? 50
  const getTitle = (n: DocNode) =>
    n.type === 'item' ? n.item.title : (n as any).title

  const sortNode = (n: DocNode) => {
    if (n.type === 'node') {
      n.children.sort((a, b) => {
        const ao = getOrder(a)
        const bo = getOrder(b)
        if (ao !== bo) return ao - bo
        return String(getTitle(a)).localeCompare(String(getTitle(b)), 'ja')
      })
      n.children.forEach(ch => ch.type === 'node' && sortNode(ch))
    }
  }

  const tree = Object.values(roots)
  tree.forEach(sortNode)
  tree.sort((a, b) => getOrder(a) - getOrder(b))
  return tree
}
