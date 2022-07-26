import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isRootNode,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  GridSelection,
  LexicalCommand,
  NodeSelection,
  RangeSelection,
} from 'lexical'
import { FC, useEffect } from 'react'

import { $createYouTubeNode, TCreateYouTubeNode } from '@/customnodes/YouTubeNode'
import { TProps as TYouTubeProps } from '@/components/parts/YouTube'

export type InsertYoutubePayload = Readonly<TCreateYouTubeNode>

export const INSERT_YOUTUBE_COMMAND: LexicalCommand<string> = createCommand()

export const YouTubePlugin: FC = () => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    // コマンド名と処理を登録
    return editor.registerCommand<InsertYoutubePayload>(
      INSERT_YOUTUBE_COMMAND,
      (payload) => {
        const selection: RangeSelection | NodeSelection | GridSelection | null = $getSelection()

        if ($isRangeSelection(selection)) {
          if ($isRootNode(selection.anchor.getNode())) {
            selection.insertParagraph()
          }

          const youtubeNode = $createYouTubeNode(payload)
          selection.insertNodes([youtubeNode])
        }

        return true
      },
      COMMAND_PRIORITY_EDITOR,
    )
  }, [editor])

  return null
}
