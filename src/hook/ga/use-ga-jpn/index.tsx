import { useCallback, useEffect } from 'react'

export type fieldObject = {
  text: string
}

export const useGaJapan = () => {
  return useCallback(({ text }: fieldObject) => {
    window.gtag('event', 'button_送信', {
      text,
    })
  }, [])
}
