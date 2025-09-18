declare module '*.mdx' {
  import { ComponentType } from 'react'
  const MDXContent: ComponentType<any>
  export const meta: Record<string, any> | undefined
  export default MDXContent
}
