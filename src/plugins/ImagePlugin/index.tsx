import type { LexicalCommand } from 'lexical'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { mergeRegister } from '@lexical/utils'
import {
  $getSelection,
  $isRangeSelection,
  $isRootNode,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
} from 'lexical'
import { useEffect } from 'react'
import { $createImageNode, ImageNode } from '@/customnodes/ImageNode'
import { ImagePayload } from '@/components/parts/Image'
import { FC } from 'react'

export type InsertImagePayload = Readonly<ImagePayload>

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> = createCommand()

export const ImagesPlugin = () => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return mergeRegister(
      // コマンド名とその内容を登録しておく
      editor.registerCommand<InsertImagePayload>(
        INSERT_IMAGE_COMMAND,
        (payload) => {
          const selection = $getSelection()

          if ($isRangeSelection(selection)) {
            if ($isRootNode(selection.anchor.getNode())) {
              selection.insertParagraph()
            }

            const imageNode: ImageNode = $createImageNode(payload)
            selection.insertNodes([imageNode])
          }

          return true
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    )
  }, [editor])

  return null
}
