import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  $getSelection,
  $isRangeSelection,
  $isRootNode,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
} from 'lexical'
import { FC, useEffect } from 'react'
import { mergeRegister } from '@lexical/utils'
import { $createDividerNode } from '@/customnodes/DividerNode'

export const INSERT_DIVIDER_COMMAND: LexicalCommand<null> = createCommand()

export const DividerPlugin: FC = () => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        INSERT_DIVIDER_COMMAND,
        () => {
          const selection = $getSelection()

          if ($isRangeSelection(selection)) {
            if ($isRootNode(selection.anchor.getNode())) {
              selection.insertParagraph()
            }

            const dividerNode = $createDividerNode()
            selection.insertNodes([dividerNode])
          }

          return true
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    )
  }, [editor])

  return null
}
