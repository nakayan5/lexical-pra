// editorstateの確認のため

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getRoot } from 'lexical'
import { mdiSend } from '@mdi/js'
import { FC, memo, useCallback } from 'react'
import { useRecoilState } from 'recoil'
import styled, { css } from 'styled-components'
import { Icon } from '../Icon'
import { editorState } from '@/recoil/editor'

// ========================================================================
// Style
// ========================================================================

const Wrap = styled.div`
  background: #fff;
  display: flex;
  justify-content: flex-end;
  padding: 10px 10px;
  margin-top: 1px;
`

const IconWrap = styled.div<{ isDisabled?: boolean }>`
  cursor: pointer;
  line-height: 0;

  &:hover {
    opacity: 0.7;
  }

  ${(props) =>
    props.isDisabled &&
    css`
      pointer-events: none;
      opacity: 0.5;
    `}
`

// =================================================================
// View
// =================================================================

export const ToolFooter: FC = memo(() => {
  const [editor] = useLexicalComposerContext()
  const [, setState] = useRecoilState(editorState)

  const onClickSend = useCallback(() => {
    const editorState = editor.getEditorState()

    setState({ data: JSON.stringify(editorState.toJSON()) })

    console.log(JSON.stringify(editorState.toJSON()))

    editor.update(() => {
      const root = $getRoot()
      root.clear()
    })
  }, [editor])

  return (
    <Wrap>
      <IconWrap
        onClick={() => {
          onClickSend()
        }}
      >
        <Icon path={mdiSend} />
      </IconWrap>
    </Wrap>
  )
})
