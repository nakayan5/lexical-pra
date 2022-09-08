import { FC, KeyboardEvent, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'

// lexical
import {
  $getSelection,
  $isRangeSelection,
  GridSelection,
  LexicalEditor,
  NodeSelection,
  RangeSelection,
  SELECTION_CHANGE_COMMAND,
  EditorState,
  TextNode,
  ElementNode,
} from 'lexical'
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'
import { mergeRegister } from '@lexical/utils'

import { LowPriority } from '@/components/parts/ToolHeader/constants'
import styled from 'styled-components'
import { positionEditorElement, getSelectedNode } from '@/utils'
import { Icon } from '@/components/parts/Icon'
import { mdiPencil } from '@mdi/js'

// ========================================================================
// Type
// ========================================================================

type TProps = {
  editor: LexicalEditor
}

type TRegisterUpdateListener = {
  editorState: EditorState
}

// ========================================================================
// Style
// ========================================================================

const LinkEditor = styled.div`
  position: absolute;
  z-index: 100;
  top: -10000px;
  left: -10000px;
  margin-top: -6px;
  max-width: 300px;
  width: 100%;
  opacity: 0;
  background-color: #fff;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  transition: opacity 0.5s;
`

const LinkInput = styled.input`
  display: block;
  width: calc(100% - 24px);
  box-sizing: border-box;
  margin: 8px 12px;
  padding: 8px 12px;
  border-radius: 15px;
  background-color: #eee;
  font-size: 15px;
  color: rgb(5, 5, 5);
  border: 0;
  outline: 0;
  position: relative;
  font-family: inherit;
`

const AnchorWrap = styled.div`
  padding: 10px;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const LinkAnchor = styled.a`
  color: rgb(33, 111, 219);
  text-decoration: none;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  margin-right: 30px;
  text-overflow: ellipsis;
`

const Button = styled.div`
  background-size: 16px;
  background-position: center;
  background-repeat: no-repeat;
  vertical-align: -0.25em;
  cursor: pointer;
`

const IconWrap = styled.div`
  line-height: 0;
`

// ========================================================================
// View
// ========================================================================

export const FloatingLinkEditor: FC<TProps> = memo(({ editor }: TProps) => {
  const mouseDownRef = useRef(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [isEditMode, setEditMode] = useState(false)
  const [lastSelection, setLastSelection] = useState<
    RangeSelection | NodeSelection | GridSelection | null
  >(null)

  const editorRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const updateLinkEditor = useCallback(() => {
    const selection: RangeSelection | NodeSelection | GridSelection | null = $getSelection()

    if ($isRangeSelection(selection)) {
      const node: TextNode | ElementNode = getSelectedNode(selection)

      const parent = node.getParent()

      if ($isLinkNode(parent)) {
        setLinkUrl(parent.getURL())
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL())
      } else {
        setLinkUrl('')
      }
    }

    const editorElem = editorRef.current
    const nativeSelection = window.getSelection()
    const activeElement = document.activeElement // ContentEditableを取得する

    if (!editorElem) return

    const rootElement: Element | null = editor.getRootElement()

    // linkEditorの位置を調整する処理
    if (
      selection &&
      nativeSelection &&
      !nativeSelection.isCollapsed &&
      rootElement &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const domRange = nativeSelection.getRangeAt(0)

      const rect = domRange.getBoundingClientRect()

      if (!mouseDownRef.current) positionEditorElement(editorElem, rect)

      setLastSelection(selection)
    }

    if (!activeElement) {
      positionEditorElement(editorElem, null)
      setLastSelection(null)
      setEditMode(false)
      setLinkUrl('')
    }

    return true
  }, [editor])

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }: TRegisterUpdateListener) =>
        editorState.read(() => updateLinkEditor()),
      ),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor()
          return true
        },
        LowPriority,
      ),
    )
  }, [editor, updateLinkEditor])

  useEffect(() => {
    editor.getEditorState().read(() => updateLinkEditor())
  }, [editor, updateLinkEditor])

  useEffect(() => {
    if (isEditMode && inputRef.current) inputRef.current.focus()
  }, [isEditMode])

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        if (lastSelection) {
          if (linkUrl !== '') editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl)

          setEditMode(false)
        }
      } else if (event.key === 'Escape') {
        event.preventDefault()
        setEditMode(false)
      }
    },
    [lastSelection, linkUrl],
  )

  // 編集する時のElement
  const editModeEl = useMemo(
    () => (
      <LinkInput
        ref={inputRef}
        value={linkUrl}
        onChange={(event) => setLinkUrl(event.target.value)}
        onKeyDown={onKeyDown}
      />
    ),
    [linkUrl, inputRef, onKeyDown, setLinkUrl],
  )

  // 編集しない時のElement
  const notEditModeEl = useMemo(
    () => (
      <AnchorWrap>
        <LinkAnchor href={linkUrl} target='_blank' rel='noopener noreferrer'>
          {linkUrl}
        </LinkAnchor>
        <Button
          role='button'
          tabIndex={0}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => setEditMode(true)}
        >
          <IconWrap>
            <Icon path={mdiPencil} size={24} />
          </IconWrap>
        </Button>
      </AnchorWrap>
    ),
    [linkUrl],
  )

  return <LinkEditor ref={editorRef}>{isEditMode ? editModeEl : notEditModeEl}</LinkEditor>
})
