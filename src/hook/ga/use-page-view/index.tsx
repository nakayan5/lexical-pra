import { useCallback, useEffect } from 'react'

import { useRouter } from 'next/router'
import { GA_ID } from '@/constants'

export const usePageview = () => {
  const router = useRouter()

  const pageview = useCallback((path: string) => {
    if (!window) return
    if (!window.gtag) return

    window.gtag('config', GA_ID, {
      page_path: path,
    })
  }, [])

  useEffect(() => {
    const handleRouteChange = (path: string) => {
      pageview(path)
    }

    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
