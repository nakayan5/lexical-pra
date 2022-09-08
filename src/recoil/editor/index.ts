import { EditorState } from 'lexical'
import { atom, RecoilState } from 'recoil'

type TEditorState = {
  data: string
}

export const editorState = atom<TEditorState>({
  key: 'editorState',
  default: {
    data: '',
  },
})
