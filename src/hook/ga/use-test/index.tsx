import { useCallback, useEffect } from 'react'

export type fieldObject = {
  id: string
}

export const useGaTest = () => {
  return useCallback(({ id }: fieldObject) => {
    window.gtag('event', 'test', {
      id,
    })
  }, [])
}
