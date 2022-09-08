import { useCallback, useEffect } from 'react'

export type fieldObject = {
  event_label: string
  event_category: string
  value?: string
}

export const useGaClickSend = () => {
  return useCallback(({ event_category, event_label, value }: fieldObject) => {
    window.gtag('event', 'editor_send', {
      event_category,
      event_label,
      value: value,
    })
  }, [])
}
