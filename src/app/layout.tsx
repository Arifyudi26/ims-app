'use client'

import 'react-perfect-scrollbar/dist/css/styles.css'
import type { ChildrenType } from '@core/types'

import '@/app/globals.css'
import '@assets/iconify-icons/generated-icons.css'

const RootLayout = ({ children }: ChildrenType) => {
  const direction = 'ltr'

  return (
    <html id='__next' dir={direction}>
      <body className='flex is-full min-bs-full flex-auto flex-col'>{children}</body>
    </html>
  )
}

export default RootLayout
