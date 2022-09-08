# package/lexical-markdown についてのメモ

### Import and export

```javascript
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from '@lexical/markdown';

editor.update(() => {
  const markdown = $convertToMarkdownString(TRANSFORMERS);  // markdownに変換
  ...
});

editor.update(() => {
  $convertFromMarkdownString(markdown, TRANSFORMERS);  // editorをupdateしてスタイルを変える
});
```

markdown を初期から変更したい場合は`RichTextPlugin`の `initialEditorState` で変換してあげる。

```javascript
<LexicalComposer>
  <RichTextPlugin initialEditorState={() => $convertFromMarkdownString(markdown, TRANSFORMERS)} />
</LexicalComposer>
```

markdown の機能は tarnsformer の設定で決まる。
これは import, export, typing 中に text や node がどのように処理されるかを定義したオブジェクトの配列。

```javascript
// ELEMENT_TRANSFORMERS : トップレベルの要素 (リスト、見出し、引用符、テーブル、コードブロック) を処理します
const ELEMENT_TRANSFORMERS: Array<ElementTransformer> = [
  HEADING,
  QUOTE,
  CODE,
  UNORDERED_LIST,
  ORDERED_LIST,
]

// TEXT_FORMAT_TRANSFORMERS : TextFormatTypeで定義されたテキスト範囲のformatを適用する
const TEXT_FORMAT_TRANSFORMERS: Array<TextFormatTransformer> = [
  INLINE_CODE,
  BOLD_ITALIC_STAR,
  BOLD_ITALIC_UNDERSCORE,
  BOLD_STAR,
  BOLD_UNDERSCORE,
  ITALIC_STAR,
  ITALIC_UNDERSCORE,
  STRIKETHROUGH,
]

// TEXT_MATCH_TRANSFORMERS : leaf text nodeのコンテンツのマッチングに依存
const TEXT_MATCH_TRANSFORMERS: Array<TextMatchTransformer> = [LINK]

// デフォルト引数ではこれが定義されている
const TRANSFORMERS: Array<Transformer> = [
  ...ELEMENT_TRANSFORMERS,
  ...TEXT_FORMAT_TRANSFORMERS,
  ...TEXT_MATCH_TRANSFORMERS,
]
```
