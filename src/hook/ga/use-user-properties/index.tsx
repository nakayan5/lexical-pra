import { useEffect } from 'react'

export const useUserProperties = (userId: string) => {
  useEffect(() => {
    process.nextTick(() => {
      window.gtag('set', 'user_properties', {
        user_id: userId,
      })
    })
  }, [userId])
}
