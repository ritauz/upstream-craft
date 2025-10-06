import React from 'react'
import { Link } from 'react-router-dom'

export const mdxComponents = {
  h2: (p: any) => <h2 className="text-2xl font-bold mt-8" {...p} />,
  pre: (p: any) => <pre className="rounded-lg p-4 bg-gray-900 text-white overflow-x-auto" {...p} />,
  a: ({ href = '', children, ...rest }: any) =>
    href.startsWith('/docs/')
      ? <Link to={href} {...rest}>{children}</Link>
      : <a href={href} target="_blank" rel="noreferrer" {...rest}>{children}</a>,
}
