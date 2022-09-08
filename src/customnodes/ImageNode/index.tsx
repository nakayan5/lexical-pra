import type { DOMExportOutput, EditorConfig, LexicalNode, NodeKey } from 'lexical'

import { DecoratorNode } from 'lexical'
import * as React from 'react'
import { ImageComponent, ImagePayload } from '@/components/parts/Image'

// JSONにシリアライズする時の型
export type SerializedImageNode = {
  altText: string
  height?: number
  maxWidth: number
  src: string
  width?: number
  type: 'image'
  version: 1
}

// テキストではないのでDecoratorNodeにextendsする
// TextNode や ElementNodeではない
export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string
  __altText: string
  __width: 'inherit' | number
  __height: 'inherit' | number
  __maxWidth: number

  // * required 詳しくは ~/memo/custom-node.md
  static getType(): string {
    return 'image' // 分かりやすい任意の文字でいい
  }

  // * required 詳しくは ~/memo/custom-node.md
  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__maxWidth,
      node.__width,
      node.__height,
      node.__key,
    )
  }

  // JSONからImageNodeに変換
  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { altText, height, width, maxWidth, src } = serializedNode
    return $createImageNode({
      altText,
      height,
      maxWidth,
      src,
      width,
    })
  }

  constructor(
    src: string,
    altText: string,
    maxWidth: number,
    width?: 'inherit' | number,
    height?: 'inherit' | number,
    key?: NodeKey,
  ) {
    super(key)
    this.__src = src
    this.__altText = altText
    this.__maxWidth = maxWidth
    this.__width = width || 'inherit'
    this.__height = height || 'inherit'
  }

  // DOMに変換
  exportDOM(): DOMExportOutput {
    const element = document.createElement('img') // imgタグとして定義する
    element.setAttribute('src', this.__src)
    element.setAttribute('alt', this.__altText)
    return { element }
  }

  // JSONに変換
  exportJSON(): SerializedImageNode {
    return {
      altText: this.getAltText(),
      height: this.__height === 'inherit' ? 0 : this.__height,
      maxWidth: this.__maxWidth,
      src: this.getSrc(),
      type: 'image',
      version: 1,
      width: this.__width === 'inherit' ? 0 : this.__width,
    }
  }

  setWidthAndHeight(width: 'inherit' | number, height: 'inherit' | number): void {
    const writable = this.getWritable<ImageNode>() // ImageNodeのクローンを作成
    writable.__width = width
    writable.__height = height
  }

  // おそらく親要素を作っている
  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span')
    const className = config.theme.image // themeで渡されるimageのclassnameが渡される
    if (className !== undefined) {
      span.className = className
    }
    return span
  }

  // 詳しくは ~/memo/custom-node.md
  updateDOM(): boolean {
    return false
  }

  getSrc(): string {
    return this.__src
  }

  getAltText(): string {
    return this.__altText
  }

  decorate(): JSX.Element {
    return (
      <ImageComponent
        src={this.__src}
        altText={this.__altText}
        width={this.__width}
        height={this.__height}
        maxWidth={this.__maxWidth}
        nodeKey={this.getKey()}
      />
    )
  }
}

// ImageNodeを作成する
export function $createImageNode({
  altText,
  height,
  maxWidth = 500,
  src,
  width,
  key,
}: ImagePayload): ImageNode {
  return new ImageNode(src, altText, maxWidth, width, height, key)
}

// ImageNodeかどうか
export function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode {
  return node instanceof ImageNode
}
