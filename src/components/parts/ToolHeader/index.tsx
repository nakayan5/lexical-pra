// react
import { FC, useCallback, useEffect, useMemo, useState } from 'react'

// component
import { Icon } from '@/components/parts/Icon'
import { LowPriority } from './constants'

// lexical
import {
  SELECTION_CHANGE_COMMAND, // selectionを変えるコマンド
  FORMAT_TEXT_COMMAND, // formatを変えるコマンド
  $getSelection, // editorStateのgetActiveEditorStateで＿selectionを返してる
  $isRangeSelection,
  RangeSelection,
  NodeSelection,
  GridSelection,
  TextNode,
  ElementNode,
  FORMAT_ELEMENT_COMMAND,
} from 'lexical'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'
import { $patchStyleText, $wrapLeafNodesInElements } from '@lexical/selection'
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  HeadingTagType,
} from '@lexical/rich-text'
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from '@lexical/list'
import { mergeRegister } from '@lexical/utils'

import styled, { css } from 'styled-components'
import {
  mdiColorHelper,
  mdiCommentQuoteOutline,
  mdiFormatAlignCenter,
  mdiFormatAlignLeft,
  mdiFormatAlignRight,
  mdiFormatBold,
  mdiFormatColorText,
  mdiFormatHeader1,
  mdiFormatHeader2,
  mdiFormatItalic,
  mdiFormatListBulleted,
  mdiFormatListNumbered,
  mdiFormatStrikethrough,
  mdiFormatUnderline,
  mdiImage,
  mdiLink,
  mdiSlashForward,
  mdiYoutube,
} from '@mdi/js'
import { getSelectedNode } from '@/utils'
import { FloatingLinkEditor } from '@/components/parts/FloatingLinkEditor'
import { createPortal } from 'react-dom'
import { INSERT_IMAGE_COMMAND } from '@/plugins/ImagePlugin'
import { INSERT_YOUTUBE_COMMAND } from '@/plugins/YouTubePlugin'
import { INSERT_DIVIDER_COMMAND } from '@/plugins/DividerPlugin'

// =========================================================================================================================================
// Type
// =========================================================================================================================================

type THeadingTagType = Extract<HeadingTagType, 'h1' | 'h2'>

const youtubeId = 'UcxNBBtjDOM'

// =========================================================================================================================================
// Style
// =========================================================================================================================================

const ToolbarWrap = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 1px;
  background: #fff;
  padding: 4px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  vertical-align: middle;
`

const ToolbarItem = styled.button`
  border: 0;
  display: flex;
  border-radius: 10px;
  padding: 8px;
  cursor: pointer;
`

const ToolbarItemSpaced = styled(ToolbarItem)<{ isActive: boolean }>`
  margin-right: 2px;

  ${(props) =>
    props.isActive
      ? css`
          background-color: #eee;
        `
      : css`
          background-color: white;
        `}
`

const InputWrap = styled.label`
  border: 0;
  display: flex;
  border-radius: 10px;
  padding: 8px;
  cursor: pointer;
`

const Input = styled.input`
  outline: none;
`

const ColorWrap = styled.div`
  position: relative;
`

const ColorInner = styled.div<{ isActive: boolean }>`
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 10px;
  background-color: #fff;
  display: none;
  border: 1px solid #eee;
  z-index: 1;
  transform: translateY(100%);

  ${(props) =>
    props.isActive &&
    css`
      display: block;
    `};
`

const RedWrap = styled.div`
  width: 10px;
  height: 10px;
  background-color: red;
  cursor: pointer;
`

const BlueWrap = styled.div`
  width: 10px;
  height: 10px;
  background-color: blue;
  cursor: pointer;
`

// ==================================================================================================================================
// View
// ==================================================================================================================================

export const ToolHeader: FC = () => {
  const [editor] = useLexicalComposerContext()

  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isStrikethrough, setIsStrikethrough] = useState(false)
  const [isLink, setIsLink] = useState(false)
  const [isLeft, setIsLeft] = useState(false)
  const [isCenter, setIsCenter] = useState(false)
  const [isRight, setIsRight] = useState(false)
  const [isTextColorOpen, setIsTextColorOpen] = useState(false)
  const [isBackgroundColorOpen, setIsBackgroundColorOpen] = useState(false)
  const [blockType, setBlockType] = useState<string>('paragraph')

  // ==================================================================================================================================
  // useCallback
  // ==================================================================================================================================

  const setLink = useCallback((selectNode: RangeSelection) => {
    const node: TextNode | ElementNode | undefined = getSelectedNode(selectNode) // textを取得

    if (!node) return

    const parent: ElementNode | null = node.getParent() // paragraphを取得 (TreeViewとlog()を見てもらえると分かりやすいです)

    // console.log('node ----------', node)
    // console.log('parent ----------', parent)

    if ($isLinkNode(parent) || $isLinkNode(node)) return setIsLink(true)

    setIsLink(false)
  }, [])

  // リンクを差し込む
  const insertLink = useCallback(() => {
    if (!isLink) return editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://')

    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
  }, [editor, isLink])

  // Youtube動画を埋め込む
  const insertYoutube = useCallback(() => {
    editor.dispatchCommand(
      INSERT_YOUTUBE_COMMAND,
      { src: `https://www.youtube-nocookie.com/embed/${youtubeId}`, width: 560, height: 316 }, // 特定の動画をむ込んでます idを変更すれば動画を変えられます。
    )
  }, [editor])

  // fileを読み込む処理
  const loadImage = useCallback((files: FileList | null) => {
    if (!files) return

    const reader = new FileReader()
    reader.readAsDataURL(files[0])
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // 登録しておいたINSERT_IMAGE_COMMANDを呼び出す
        editor.dispatchCommand(INSERT_IMAGE_COMMAND, { src: reader.result })
      }
    }
  }, [])

  // headingに変換 (h1 / h2)
  const formatHeading = useCallback(
    (heading: THeadingTagType) => {
      if (blockType !== heading) {
        editor.update(() => {
          const selection = $getSelection()

          if ($isRangeSelection(selection)) {
            // TODO: 理解  HeadingNodeを作成
            $wrapLeafNodesInElements(selection, () => $createHeadingNode(heading))
          }
        })
      }
    },
    [blockType, editor],
  )

  // alignを変更
  const formatAlign = useCallback((elementNode: ElementNode) => {
    setIsLeft(false)
    setIsCenter(false)
    setIsRight(false)

    if (elementNode.hasFormat('left')) {
      return setIsLeft(true)
    }

    if (elementNode.hasFormat('center')) {
      return setIsCenter(true)
    }

    if (elementNode.hasFormat('right')) {
      return setIsRight(true)
    }

    console.log('topLevelNode ----', elementNode)
  }, [])

  // 引用に変換
  // Shift + Enter でquoteのまま改行できる その実装は内部でされてる
  const formatQuote = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection()

      if ($isRangeSelection(selection)) {
        $wrapLeafNodesInElements(selection, () => $createQuoteNode())
      }
    })
  }, [])

  // bulletリストに変換
  const formatBulletList = () => {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, '')
  }

  // numberリストに変換
  const formatNumberList = () => {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, '')
  }

  // textの色を変更
  const changeTextColor = useCallback(
    (style: Record<string, string>) => {
      editor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, style)
        }
      })
      setIsTextColorOpen(false)
    },
    [editor],
  )

  // 背景色を変更
  const changeBackgroundColor = useCallback(
    (style: Record<string, string>) => {
      editor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, style)
        }
      })
      setIsBackgroundColorOpen(false)
    },
    [editor],
  )

  // ToolHeaderの状態をupdateする処理
  const updateToolHeader = useCallback(() => {
    const selection: RangeSelection | NodeSelection | GridSelection | null = $getSelection() //  選択している箇所をgetする

    // RangeSelectionなのか確かめる型ガード
    if ($isRangeSelection(selection)) {
      // headingの処理
      const anchorNode = selection.anchor.getNode()
      const topLevelNode = anchorNode.getTopLevelElement() // 選択箇所の親のnodeを取得

      if (topLevelNode) {
        const type = $isHeadingNode(topLevelNode) ? topLevelNode.getTag() : topLevelNode.getType()
        setBlockType(type)
      }

      // formatを変える処理
      setIsBold(selection.hasFormat('bold'))
      setIsItalic(selection.hasFormat('italic'))
      setIsUnderline(selection.hasFormat('underline'))
      setIsStrikethrough(selection.hasFormat('strikethrough'))

      // Linkの処理
      setLink(selection)
    }
  }, [editor, setLink, formatAlign])

  // ==================================================================================================================================
  // useEffelct
  // ==================================================================================================================================

  useEffect(() => {
    // mergeRegister : 中身はforEachで順次実行してるだけ
    return mergeRegister(
      // editorStateを読み込んだ段階でupdateを走らせる処理
      editor.registerUpdateListener(({ editorState }) =>
        editorState.read(() => updateToolHeader()),
      ),
      // あらかじめcommand名とその処理を登録しておく
      // registerCommand<P>(
      //   command: LexicalCommand<P>,
      //   listener: CommandListener<P>,
      //   priority: CommandListenerPriority,
      // ): () => void
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND, // selectionが変わったタイミングで走らせる
        () => {
          updateToolHeader()
          return false
        },
        LowPriority,
      ),
    )
  }, [editor, updateToolHeader])

  // ==================================================================================================================================
  // Element
  // ==================================================================================================================================

  // boldEl
  const boldEl = useMemo(
    () => (
      <ToolbarItemSpaced
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')} // FORMAT_TEXT_COMMANDを呼び出す
        isActive={isBold}
        title='太字'
      >
        <Icon path={mdiFormatBold} />
      </ToolbarItemSpaced>
    ),
    [isBold],
  )

  // italicEl
  const italicEl = useMemo(
    () => (
      <ToolbarItemSpaced
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        isActive={isItalic}
        title='斜字'
      >
        <Icon path={mdiFormatItalic} />
      </ToolbarItemSpaced>
    ),
    [isItalic],
  )

  //　underlineEl
  const underlineEl = useMemo(
    () => (
      <ToolbarItemSpaced
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        isActive={isUnderline}
        title='下線'
      >
        <Icon path={mdiFormatUnderline} />
      </ToolbarItemSpaced>
    ),
    [isUnderline],
  )

  // strikethroughEl
  const strikethroughEl = useMemo(
    () => (
      <ToolbarItemSpaced
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
        isActive={isStrikethrough}
        title='打ち消し戦'
      >
        <Icon path={mdiFormatStrikethrough} />
      </ToolbarItemSpaced>
    ),
    [isStrikethrough],
  )

  // insertLinkEl
  const insertLinkEl = useMemo(
    () => (
      <ToolbarItemSpaced onClick={insertLink} isActive={isLink} title='リンク'>
        <Icon path={mdiLink} />
      </ToolbarItemSpaced>
    ),
    [isLink],
  )

  // h1
  const heading1El = useMemo(
    () => (
      <ToolbarItemSpaced
        onClick={() => formatHeading('h1')}
        isActive={blockType === 'h1'}
        title='見出し１'
      >
        <Icon path={mdiFormatHeader1} />
      </ToolbarItemSpaced>
    ),
    [formatHeading],
  )

  // h2
  const heading2El = useMemo(
    () => (
      <ToolbarItemSpaced
        onClick={() => formatHeading('h2')}
        isActive={blockType === 'h2'}
        title='見出し２'
      >
        <Icon path={mdiFormatHeader2} />
      </ToolbarItemSpaced>
    ),
    [formatHeading],
  )

  // image
  const imageEl = useMemo(
    () => (
      <InputWrap title='画像'>
        <Input type={'file'} hidden={true} onChange={(e) => loadImage(e.target.files)} />
        <Icon path={mdiImage} />
      </InputWrap>
    ),
    [loadImage],
  )

  // youtube
  const youtubeEl = useMemo(
    () => (
      <ToolbarItemSpaced onClick={insertYoutube} isActive={false} title='youtube'>
        <Icon path={mdiYoutube} />
      </ToolbarItemSpaced>
    ),
    [insertYoutube],
  )

  // left
  const alignLeftEl = useMemo(
    () => (
      <ToolbarItemSpaced
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
        isActive={isLeft}
        title='左'
      >
        <Icon path={mdiFormatAlignLeft} />
      </ToolbarItemSpaced>
    ),
    [isLeft],
  )

  // center
  const alignCenterEl = useMemo(
    () => (
      <ToolbarItemSpaced
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}
        isActive={isCenter}
        title='中央'
      >
        <Icon path={mdiFormatAlignCenter} />
      </ToolbarItemSpaced>
    ),
    [isCenter],
  )

  // right
  const alignRightEl = useMemo(
    () => (
      <ToolbarItemSpaced
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}
        isActive={isRight}
        title='右'
      >
        <Icon path={mdiFormatAlignRight} />
      </ToolbarItemSpaced>
    ),
    [isRight],
  )

  // 区切り線
  const dividerEl = useMemo(
    () => (
      <ToolbarItemSpaced
        onClick={() => editor.dispatchCommand(INSERT_DIVIDER_COMMAND, '')}
        isActive={false}
        title='区切り線'
      >
        <Icon path={mdiSlashForward} />
      </ToolbarItemSpaced>
    ),
    [],
  )

  // 文字色
  const colorEl = useMemo(
    () => (
      <ColorWrap>
        <ToolbarItemSpaced
          onClick={() => setIsTextColorOpen((props) => !props)}
          isActive={false}
          title='文字色'
        >
          <Icon path={mdiFormatColorText} />
        </ToolbarItemSpaced>
        <ColorInner isActive={isTextColorOpen} onClick={() => changeTextColor({ color: 'red' })}>
          <RedWrap />
        </ColorInner>
      </ColorWrap>
    ),
    [isTextColorOpen, changeTextColor],
  )

  // 背景色
  const backgroundColorEl = useMemo(
    () => (
      <ColorWrap>
        <ToolbarItemSpaced
          onClick={() => setIsBackgroundColorOpen((props) => !props)}
          isActive={false}
          title='背景色'
        >
          <Icon path={mdiColorHelper} />
        </ToolbarItemSpaced>
        <ColorInner
          isActive={isBackgroundColorOpen}
          onClick={() => changeBackgroundColor({ 'background-color': 'blue' })}
        >
          <BlueWrap />
        </ColorInner>
      </ColorWrap>
    ),
    [isBackgroundColorOpen, changeBackgroundColor],
  )

  // code
  const quoteEl = useMemo(
    () => (
      <ToolbarItemSpaced onClick={formatQuote} isActive={false} title='引用'>
        <Icon path={mdiCommentQuoteOutline} />
      </ToolbarItemSpaced>
    ),
    [],
  )

  const bulletListEl = useMemo(
    () => (
      <ToolbarItemSpaced onClick={formatBulletList} isActive={false} title='リスト'>
        <Icon path={mdiFormatListBulleted} />
      </ToolbarItemSpaced>
    ),
    [],
  )

  const numberListEl = useMemo(
    () => (
      <ToolbarItemSpaced onClick={formatNumberList} isActive={false} title='リスト'>
        <Icon path={mdiFormatListNumbered} />
      </ToolbarItemSpaced>
    ),
    [],
  )

  return (
    <ToolbarWrap>
      {boldEl}
      {italicEl}
      {underlineEl}
      {strikethroughEl}
      {insertLinkEl}
      {isLink && createPortal(<FloatingLinkEditor editor={editor} />, document.body)}
      {heading1El}
      {heading2El}
      {imageEl}
      {youtubeEl}
      {alignLeftEl}
      {alignCenterEl}
      {alignRightEl}
      {dividerEl}
      {colorEl}
      {backgroundColorEl}
      {quoteEl}
      {bulletListEl}
      {numberListEl}
    </ToolbarWrap>
  )
}
