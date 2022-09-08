import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { mdiSend } from '@mdi/js'
import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useRecoilState } from 'recoil'
import styled, { css } from 'styled-components'
import { Icon } from '../Icon'
import { editorState } from '@/recoil/editor'
import { $getRoot } from 'lexical'
import { useGaClickSend } from '@/hook/ga/use-editor-send'
import { useGaTest } from '@/hook/ga/use-test'
import { useGaJapan } from '@/hook/ga/use-ga-jpn'

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
  const gaClickSend = useGaClickSend()
  const gaTest = useGaTest()
  const gaJapan = useGaJapan()

  const onClickSend = useCallback(() => {
    const editorState = editor.getEditorState()

    setState({ data: JSON.stringify(editorState.toJSON()) })

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

          const editorState = editor.getEditorState()

          gaClickSend({
            event_category: 'click',
            event_label: 'editor',
            value: JSON.stringify(editorState.toJSON()),
          })

          gaTest({ id: JSON.stringify(editorState.toJSON()) })

          gaJapan({ text: JSON.stringify(editorState.toJSON()) })
        }}
      >
        <Icon path={mdiSend} />
      </IconWrap>
    </Wrap>
  )
})
