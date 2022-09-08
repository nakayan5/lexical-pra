import MaterialDesignIcon from '@mdi/react'
import { ComponentProps, memo, FC } from 'react'

// ========================================================================
// Type
// ========================================================================

export type TProps = ComponentProps<typeof MaterialDesignIcon> & {
  className?: string
  size?: number
}

// ========================================================================
// View
// ========================================================================

export const Icon: FC<TProps> = memo(({ size = 24, ...props }) => {
  return <MaterialDesignIcon {...props} size={size / 30} />
})
