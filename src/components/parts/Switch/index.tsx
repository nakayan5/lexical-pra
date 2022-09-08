import { FC } from 'react'
import styled, { css } from 'styled-components'

// ========================================================================
// Type
// ========================================================================

type TProps = {
  isActive: boolean
  onClick: () => void
}

// ========================================================================
// Style
// ========================================================================

const Wrap = styled.div<{ isActive: boolean }>`
  position: relative;
  width: 100px;
  height: 25px;
  border-radius: 50px;
  overflow: hidden;
  cursor: pointer;

  &::before {
    content: '';
    font-size: 10px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: block;
    background: #999999;
    -webkit-transition: 0.2s ease-out;
    transition: 0.2s ease-out;
  }

  &::after {
    content: '';
    font-size: 10px;
    position: absolute;
    top: 3px;
    left: 3px;
    width: 19px;
    height: 19px;
    display: block;
    border-radius: 50px;
    background: #fff;
    -webkit-transition: 0.2s ease-out;
    transition: 0.2s ease-out;
  }

  display: flex;
  align-items: center;
  justify-content: flex-end;

  ${(props) =>
    props.isActive &&
    css`
      justify-content: flex-start;

      &:before {
        background: #35c759;
      }

      &:after {
        left: calc(100% - 22px);
      }
    `}
`

const Markdown = styled.span`
  font-size: 11px;
  position: relative;
  padding-left: 10px;
  font-weight: bold;
  color: white;
`

const Normal = styled.span`
  font-size: 11px;
  position: relative;
  padding-right: 10px;
  font-weight: bold;
  color: white;
`

// ========================================================================
// View
// ========================================================================

export const Switch: FC<TProps> = ({ isActive, onClick }: TProps) => {
  return (
    <Wrap onClick={onClick} isActive={isActive}>
      {isActive && <Markdown>Markdown</Markdown>}
      {!isActive && <Normal>Normal</Normal>}
    </Wrap>
  )
}
