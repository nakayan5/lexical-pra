import { DecoratorNode, DOMExportOutput, EditorConfig, NodeKey } from 'lexical'
import { Divider } from '@/components/parts/Divider'

export class DividerNode extends DecoratorNode<JSX.Element> {
  constructor(key?: NodeKey) {
    super(key)
  }
  // * required https://github.com/nakayan5/lexical-pra/blob/develop/memo/custom-node.md
  static getType(): string {
    return 'divider'
  }

  // * required https://github.com/nakayan5/lexical-pra/blob/develop/memo/custom-node.md
  static clone(node: DividerNode): DividerNode {
    return new DividerNode(node.__key)
  }

  // JSONからImageNodeに変換
  static importJSON(): DividerNode {
    return $createDividerNode()
  }

  // DOMに変換
  exportDOM(): DOMExportOutput {
    const element = document.createElement('span') // imgタグとして定義する
    return { element }
  }

  // JSONに変換
  exportJSON(): any {
    return {
      type: 'divider',
      version: 1,
    }
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('div')
    return span
  }

  // https://github.com/nakayan5/lexical-pra/blob/develop/memo/custom-node.md
  updateDOM(): false {
    return false
  }

  decorate(): JSX.Element {
    return <Divider />
  }
}

// DividerNodeを作成する
export function $createDividerNode(): DividerNode {
  return new DividerNode()
}

// DividerNodeかどうか
export function $isImageNode(node: DividerNode | null | undefined): node is DividerNode {
  return node instanceof DividerNode
}
