import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { FC } from 'react'

type TProps = {
  state: string
}

export const ApplyStatePlugin: FC<TProps> = ({ state }: TProps) => {
  const [editor] = useLexicalComposerContext()

  editor.setEditorState(editor.parseEditorState(state))

  return null
}
