import { FC, Fragment, memo } from 'react'

// lexical
import LexicalComposer from '@lexical/react/LexicalComposer'
import AutoFocusPlugin from '@lexical/react/LexicalAutoFocusPlugin'
import LinkPlugin from '@lexical/react/LexicalLinkPlugin'
import ListPlugin from '@lexical/react/LexicalListPlugin'
import RichTextPlugin from '@lexical/react/LexicalRichTextPlugin'
import ContentEditable from '@lexical/react/LexicalContentEditable'
import LexicalMarkdownShortcutPlugin from '@lexical/react/LexicalMarkdownShortcutPlugin'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ListItemNode, ListNode } from '@lexical/list'
import { AutoLinkNode, LinkNode } from '@lexical/link'
import { TRANSFORMERS } from '@lexical/markdown'

// component
import { TreeView } from '@/components/parts/TreeView'
import { ToolHeader } from '@/components/parts/ToolHeader'
import { ToolFooter } from '@/components/parts/ToolFooter'
import { AutoLink } from '@/components/parts/AutoLink'

// plugin
import { ApplyStatePlugin } from '@/plugins/DisplayStatePlugin'
import { ImagesPlugin } from '@/plugins/ImagePlugin'
import { YouTubePlugin } from '@/plugins/YouTubePlugin'
import { ImageNode } from '@/customnodes/ImageNode'
import { YouTubeNode } from '@/customnodes/YouTubeNode'
import { DividerNode } from '@/customnodes/DividerNode'

// theme
import { theme } from '../../../theme/index'
import styled, { css } from 'styled-components'
import { DividerPlugin } from '@/plugins/DividerPlugin'

// =================================================================
// Type
// =================================================================

type TProps = {
  isReadonly: boolean
  isMarkdown: boolean
  editorState?: string
}

type TLexicalComposerProps = Parameters<typeof LexicalComposer>
type TEditorConfig = Pick<TLexicalComposerProps[0], 'initialConfig'>

// =================================================================
// Style
// =================================================================

const EditorContainer = styled.div`
  border-radius: 2px;
  color: #000;
  position: relative;
  line-height: 20px;
  font-weight: 400;
  text-align: left;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`

const EditorInner = styled.div`
  background: #fff;
  position: relative;
`

const ContentEditableWrap = styled.div<{ isEditorState: boolean }>`
  ${(props) =>
    props.isEditorState
      ? css`
          border-radius: 10px;
        `
      : css`
          min-height: 400px;
          border-radius: 10px;
        `}

  & .contenteditable {
    min-height: inherit;
    resize: none;
    font-size: 15px;
    caret-color: rgb(5, 5, 5);
    position: relative;
    tab-size: 1;
    outline: 0;
    padding: 15px 10px;
    caret-color: #444;
  }

  // themeで定義したclassNameでstyleを変えている

  & .editor-text-bold {
    font-weight: normal;
  }

  & .editor-text-italic {
    font-style: italic;
  }

  & .editor-text-underline {
    text-decoration: underline;
  }

  & .editor-text-strikethrough {
    text-decoration: line-through;
  }

  & .editor-text-underlineStrikethrough {
    text-decoration: underline line-through;
  }

  & .editor-link {
    color: rgb(33, 111, 219);
    text-decoration: none;
  }

  & .editor-paragraph {
    margin: 0;
    margin-bottom: 8px;
    position: relative;
  }

  & .editor-paragraph:last-child {
    margin-bottom: 0;
  }

  & .editor-heading-h1 {
    font-size: 32px;
    font-weight: bold;
    margin: 0;
    margin-bottom: 12px;
    padding: 0;
  }

  & .editor-heading-h2 {
    font-size: 18px;
    font-weight: bold;
    margin: 0;
    margin-bottom: 10px;
    padding: 0;
  }

  & .editor-quote {
    margin: 0 0 0 10px;
    font-size: 15px;
    color: #ccc;
    border-left-color: #ccc;
    border-left-width: 4px;
    border-left-style: solid;
    padding-left: 16px;
  }

  & .editor-list-ol {
    padding: 0;
    margin: 0;
    margin-left: 10px;
  }

  & .editor-list-ul {
    padding: 0;
    margin: 0;
    margin-left: 10px;
  }

  & .editor-listitem {
    margin: 8px 16px 8px 16px;
  }

  & .editor-nested-listitem {
    list-style-type: none;
  }

  & .editor-youtube {
    max-width: 516px;
  }
`

// =================================================================
// View
// =================================================================

export const RichTextEditor: FC<TProps> = memo(
  ({ isReadonly, isMarkdown, editorState }: TProps) => {
    // エディタの設定
    const editorConfig: TEditorConfig = {
      initialConfig: {
        // 使用するthemeを渡す
        theme,
        readOnly: isReadonly,
        onError(error: unknown) {
          throw error
        },
        // 使用するNodeのClassを渡す
        nodes: [
          HeadingNode,
          ListNode,
          ListItemNode,
          QuoteNode,
          AutoLinkNode,
          LinkNode,
          ImageNode,
          YouTubeNode,
          DividerNode,
        ],
      },
    }

    return (
      <LexicalComposer initialConfig={editorConfig.initialConfig}>
        <EditorContainer>
          {!isReadonly ? <ToolHeader /> : null}
          <EditorInner>
            <RichTextPlugin
              contentEditable={
                <ContentEditableWrap isEditorState={!!editorState}>
                  <ContentEditable className='contenteditable' />
                </ContentEditableWrap>
              }
              placeholder={null}
            />
            <AutoLink />
            <ImagesPlugin />
            <YouTubePlugin />
            <DividerPlugin />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <LinkPlugin />
            <ListPlugin />
            {isMarkdown && <LexicalMarkdownShortcutPlugin transformers={TRANSFORMERS} />}
            {editorState && <ApplyStatePlugin state={editorState} />}
          </EditorInner>
          {!isReadonly && (
            <Fragment>
              <ToolFooter />
              <TreeView />
            </Fragment>
          )}
        </EditorContainer>
      </LexicalComposer>
    )
  },
)
