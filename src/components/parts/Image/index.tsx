import { $isImageNode } from '@/customnodes/ImageNode'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import useLexicalNodeSelection from '@lexical/react/useLexicalNodeSelection'
import { mergeRegister } from '@lexical/utils'
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  NodeKey,
} from 'lexical'
import { useCallback, useEffect, useRef } from 'react'

// ===========================================
// Type
// ===========================================

export type ImagePayload = {
  src: string
  altText: string
  width?: number
  maxWidth?: number
  height?: number
  key?: NodeKey
}

type TImageComponentProps = {
  src: string
  altText: string
  width: 'inherit' | number
  maxWidth: number
  height: 'inherit' | number
  nodeKey: NodeKey
}

// ===========================================
// View
// ===========================================

export const ImageComponent = ({
  src,
  altText,
  nodeKey,
  width,
  height,
  maxWidth,
}: TImageComponentProps): JSX.Element => {
  const ref = useRef<HTMLImageElement>(null)
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey)
  const [editor] = useLexicalComposerContext()

  const onDelete = useCallback(
    (event: KeyboardEvent) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        event.preventDefault()

        editor.update(() => {
          const node = $getNodeByKey(nodeKey)

          if ($isImageNode(node)) node.remove()

          setSelected(false)
        })
      }

      return false
    },
    [editor, isSelected, nodeKey, setSelected],
  )

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        (payload) => {
          const event = payload

          if (event.target === ref.current) {
            if (!event.shiftKey) clearSelection()

            setSelected(!isSelected)
            return true
          }

          return false
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(KEY_DELETE_COMMAND, onDelete, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_BACKSPACE_COMMAND, onDelete, COMMAND_PRIORITY_LOW),
    )
  }, [clearSelection, editor, isSelected, nodeKey, onDelete, setSelected])

  return (
    <img
      src={src}
      alt={altText}
      ref={ref}
      style={{
        height: height,
        maxWidth: maxWidth,
        width: width,
      }}
      draggable='false'
    />
  )
}
