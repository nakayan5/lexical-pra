// lexical
import { ElementNode, RangeSelection, TextNode } from 'lexical'
import { $isAtNodeEnd } from '@lexical/selection'

// floating postionを変更
export const positionEditorElement = (editor: HTMLElement, rect: DOMRectReadOnly | null): void => {
  if (!rect) {
    editor.style.opacity = '0'
    editor.style.top = '-1000px'
    editor.style.left = '-1000px'
    return
  }

  editor.style.opacity = '1'
  editor.style.top = `${rect.top + rect.height + window.pageYOffset + 10}px`
  editor.style.left = `${
    rect.left + window.pageXOffset - editor.offsetWidth / 2 + rect.width / 2
  }px`
}

// 選択しているNodeを取得
export const getSelectedNode = (selection: RangeSelection): TextNode | ElementNode => {
  const anchor = selection.anchor
  const focus = selection.focus
  const anchorNode = selection.anchor.getNode()
  const focusNode = selection.focus.getNode()

  if (anchorNode === focusNode) return anchorNode

  const isBackward = selection.isBackward()

  if (isBackward) return $isAtNodeEnd(focus) ? anchorNode : focusNode

  return $isAtNodeEnd(anchor) ? focusNode : anchorNode
}
