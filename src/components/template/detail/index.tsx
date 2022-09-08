import { usePageview } from '@/hook/ga/use-page-view'
import { useRouter } from 'next/router'
import { FC } from 'react'
import styled from 'styled-components'

// ========================================================================
// View
// ========================================================================

const Wrap = styled.div`
  width: 1100px;
  margin: 0 auto;
  padding: 50px 0;
`

const Para = styled.p`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`

const Item = styled.div`
  background-color: #dbdbdb;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 12px;
  text-align: center;
  font-weight: bold;

  &:hover {
    opacity: 0.7;
  }
`

// ========================================================================
// View
// ========================================================================

export const Detail: FC = () => {
  const router = useRouter()

  usePageview()

  return (
    <Wrap>
      <Para>ga4のテストページ</Para>

      <Para>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iure, iste eaque! Officiis amet
        tempore sit eveniet nulla, aperiam expedita, quia placeat, incidunt eius culpa. Iusto cum
        perferendis accusamus nisi repudiandae!
      </Para>

      <Item onClick={() => router.push('/')}>Toptページへ</Item>
    </Wrap>
  )
}
