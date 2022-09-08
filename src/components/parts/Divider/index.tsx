import { FC } from 'react'
import styled from 'styled-components'

// =================================================================
// Style
// =================================================================

const Wrap = styled.div`
  width: 100%;
  padding: 8px 0;
`

const Inner = styled.div`
  background-color: #eee;
  height: 1px;
  width: 100%;
`

// =================================================================
// View
// =================================================================

export const Divider: FC = () => {
  return (
    <Wrap>
      <Inner />
    </Wrap>
  )
}
