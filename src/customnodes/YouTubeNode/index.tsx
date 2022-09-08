import { DecoratorNode, DOMExportOutput, EditorConfig, LexicalNode, NodeKey } from 'lexical'

import { Youtube } from '@/components/parts/YouTube'

// ================================================================
// Type
// ================================================================

type SerializedYouTubeNode = {
  type: 'youtube'
  src: string
  width: number
  height: number
}

// ================================================================
// Class
// ================================================================

export class YouTubeNode extends DecoratorNode<JSX.Element> {
  __src: string
  __width: number | 'inherit'
  __height: number | 'inherit'

  static getType(): string {
    return 'youtube'
  }

  static clone(node: YouTubeNode): YouTubeNode {
    return new YouTubeNode(node.__src, node.__width, node.__height, node.__key)
  }

  static importJSON(serializedNode: SerializedYouTubeNode) {
    const { src, width, height } = serializedNode
    return $createYouTubeNode({ src, width, height })
  }

  constructor(src: string, width: number | 'inherit', height: number | 'inherit', key?: NodeKey) {
    super(key)
    this.__src = src
    this.__width = width || 'inherit'
    this.__height = height || 'inherit'
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('iframe')
    return { element }
  }

  exportJSON(): SerializedYouTubeNode {
    return {
      type: 'youtube',
      src: this.__src,
      height: this.__height === 'inherit' ? 0 : this.__height,
      width: this.__width === 'inherit' ? 0 : this.__width,
    }
  }

  // おそらく親要素を作っている
  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span')
    const className = config.theme.youtube
    if (className && typeof className === 'string') {
      span.className = className
    }
    return span
  }

  updateDOM(): false {
    return false
  }

  decorate(): JSX.Element {
    return (
      <Youtube
        nodeKey={this.getKey()}
        src={this.__src}
        width={this.__width}
        height={this.__height}
      />
    )
  }

  isTopLevel(): boolean {
    return false
  }
}

export type TCreateYouTubeNode = {
  src: string
  width: number
  height: number
}
// YouTubeNodeを作成
export function $createYouTubeNode({ src, width, height }: TCreateYouTubeNode): YouTubeNode {
  return new YouTubeNode(src, width, height)
}

// YouTubeNodeかどうか
export function $isYouTubeNode(
  node: YouTubeNode | LexicalNode | null | undefined,
): node is YouTubeNode {
  return node instanceof YouTubeNode
}
