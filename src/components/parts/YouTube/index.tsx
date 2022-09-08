import { FC, memo } from 'react'
import { NodeKey } from 'lexical'
import styled from 'styled-components'

// ================================================================
// Type
// ================================================================

export type TProps = {
  src: string
  width: number | 'inherit'
  height: number | 'inherit'
  nodeKey: NodeKey
}

const Wrap = styled.div`
  /* width: 100%; */
`

// ================================================================
// View
// ================================================================

export const Youtube: FC<TProps> = memo(({ src, height, width }: TProps) => {
  return (
    // src以外はyoutubeから引用
    <iframe
      //   nodeKey={nodeKey}
      // width='100%'
      // height='100%'
      //   src='https://www.youtube.com/embed/nBfpgJyDHbY'
      // width='560'
      // height='315'
      height={height}
      width={width}
      src={src}
      title='YouTube video player'
      frameBorder='0'
      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
      allowFullScreen={true}
    />
  )
})
