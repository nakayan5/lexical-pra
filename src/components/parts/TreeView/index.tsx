import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { TreeView } from '@lexical/react/LexicalTreeView'
import { FC } from 'react'
import styled from 'styled-components'

// ========================================================================
// Style
// ========================================================================

const Wrap = styled.div`
  & .tree-view-output {
    display: block;
    background: #222;
    color: #fff;
    padding: 5px;
    font-size: 12px;
    white-space: pre-wrap;
    margin: 1px auto 10px auto;
    max-height: 250px;
    position: relative;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    overflow: auto;
    line-height: 14px;
  }

  & .debug-timetravel-panel {
    overflow: hidden;
    padding: 0 0 10px 0;
    margin: auto;
    display: flex;
  }

  & .debug-timetravel-panel-slider {
    padding: 0;
    flex: 8;
  }

  & .debug-timetravel-panel-button {
    padding: 0;
    border: 0;
    background: none;
    flex: 1;
    color: #fff;
    font-size: 12px;
  }

  & .debug-timetravel-panel-button:hover {
    text-decoration: underline;
  }

  & .debug-timetravel-button {
    border: 0;
    padding: 0;
    font-size: 12px;
    top: 10px;
    right: 15px;
    position: absolute;
    background: none;
    color: #fff;
  }

  & .debug-timetravel-button:hover {
    text-decoration: underline;
  }
`

// =================================================================
// View
// =================================================================

export const EditorTreeView: FC = () => {
  const [editor] = useLexicalComposerContext()

  return (
    <Wrap>
      <TreeView
        viewClassName='tree-view-output'
        timeTravelPanelClassName='debug-timetravel-panel'
        timeTravelButtonClassName='debug-timetravel-button'
        timeTravelPanelSliderClassName='debug-timetravel-panel-slider'
        timeTravelPanelButtonClassName='debug-timetravel-panel-button'
        editor={editor}
      />
    </Wrap>
  )
}
