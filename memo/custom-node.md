# Custom Node

## Node Properties

Lexical Node はプロパティを持つことができる。
重要なことはそのプロパティも JSON に変換可能。
したがって、関数、シンボル、マップ、セット、その他ビルトインとは異なるプロトタイプを持つオブジェクトであるノードに、決してプロパティを代入すべきではありません。

プロパティには`__`をつけることで, そのプロパティが private であることを明確にしている。

もし、変更可能またはアクセス可能なプロパティを追加するのであれば、必ずそのプロパティのために、ノード上に get*() と set*() メソッドのセットを作成しなければなりません。
内部では、Lexical の内部 immutable システムとの一貫性を確保するために、いくつかの非常に重要なメソッドを呼び出す必要があります。これらのメソッドは、`getWritable()` と `getLatest()` です。

すべてのノードは静的な `getType()` メソッドと静的な `clone()` メソッドの両方を持つ必要があります。
Lexical は JSON から復元する際に、関連するクラスのプロトタイプでノードを再構築できるように、型を使用する。Lexical は、新しい EditorState スナップショットを作成する際の一貫性を確保するために、clone()を使用する。

```javascript
import type { NodeKey } from 'lexical'

class MyCustomNode extends LexicalNode {
  __foo: string

  static getType(): string {
    return 'text' // image or text ...etc
  }

  static clone(node: MyCustomNode): MyCustomNode {
    return new MyCustomNode(node.__foo, node.__key)
  }

  constructor(foo: string, key?: NodeKey) {
    super(key)
    this.__foo = foo
  }

  setFoo(foo: string) {
    // getWritable() はノードのクローンを作成する
    const self = this.getWritable()
    self.__foo = foo
  }

  getFoo(): string {
    // getLatest() は、EditorState から最新の値を取得することを保証します。
    // EditorStateから最新の値を取得するようにします。
    const self = this.getLatest()
    return self.__foo
  }
}
```

<br>

## Creating custom nodes

### Extending ElementNode

```javascript
import { ElementNode } from 'lexical'

export class CustomParagraph extends ElementNode {
  static getType(): string {
    return 'custom-paragraph'
  }

  static clone(node: ParagraphNode): ParagraphNode {
    return new CustomParagraph(node.__key)
  }

  createDOM(): HTMLElement {
    // ここでDOM要素を定義する
    const dom = document.createElement('p')
    return dom
  }

  updateDOM(prevNode: CustomParagraph, dom: HTMLElement): boolean {
    // falseを返すことでLexicalに createDOM による新しいコピーに置き換える必要がないことを伝える。
    return false
  }
}

//Custom Nodeクラスを作成したら そのクラスインスタンスを操作するユーティリティ関数を $prefix で定義することをエチケットとして推奨しています。
// 他の人がこのCustom Nodeを使って検証しやすくするため。
export function $createCustomParagraphNode(): ParagraphNode {
  return new CustomParagraph()
}

export function $isCustomParagraphNode(node: ?LexicalNode): boolean {
  return node instanceof CustomParagraph
}
```

<br>

### Extending TextNode

```javascript
export class ColoredNode extends TextNode {
  __color: string

  constructor(text: string, color: string, key?: NodeKey): void {
    super(text, key)
    this.__color = color
  }

  static getType(): string {
    return 'colored'
  }

  static clone(node: ColoredNode): ColoredNode {
    return new ColoredNode(node.__text, node.__color, node.__key)
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = super.createDOM(config)
    element.style.color = this.__color
    return element
  }

  updateDOM(prevNode: ColoredNode, dom: HTMLElement, config: EditorConfig): boolean {
    const isUpdated = super.updateDOM(prevNode, dom, config)
    if (prevNode.__color !== this.__color) {
      dom.style.color = this.__color
    }
    return isUpdated
  }
}

export function $createColoredNode(text: string, color: string): ColoredNode {
  return new ColoredNode(text, color)
}

export function $isColoredNode(node: ?LexicalNode): boolean {
  return node instanceof ColoredNode
}
```

<br>

### Extending DecoratorNode

```javascript
export class VideoNode extends DecoratorNode<React$Node> {
  __id: string

  static getType(): string {
    return 'video'
  }

  static clone(node: VideoNode): VideoNode {
    return new VideoNode(node.__id, node.__key)
  }

  constructor(id: string, key?: NodeKey) {
    super(key)
    this.__id = id
  }

  createDOM(): HTMLElement {
    return document.createElement('div')
  }

  updateDOM(): false {
    return false
  }

  decorate(): React$Node {
    return <VideoPlayer videoID={this.__id} />
  }
}

export function $createVideoNode(id: string): VideoNode {
  return new VideoNode(id)
}

export function $isVideoNode(node: ?LexicalNode): boolean {
  return node instanceof VideoNode
}
```
