// react
import { FC, memo, useMemo } from 'react'

// component
import { Icon } from '@/components/parts/Icon'

// lexical
import {
  FORMAT_TEXT_COMMAND, // formatを変えるコマンド
  FORMAT_ELEMENT_COMMAND,
} from 'lexical'
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
import { FloatingLinkEditor } from '@/components/parts/FloatingLinkEditor'
import { createPortal } from 'react-dom'
import { INSERT_DIVIDER_COMMAND } from '@/plugins/DividerPlugin'

import { useToolHeader } from "./hooks/use-tool-header";

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

export const ToolHeader: FC = memo(() => {
  const {
    editor,
    isBackgroundColorOpen, isBold, isCenter, isItalic, isLeft, isRight, isStrikethrough, isTextColorOpen, isUnderline, isLink,
    blockType,
    insertLink,
    changeBackgroundColor,
    changeTextColor,
    formatBulletList,
    formatNumberList,
    formatQuote,
    formatHeading,
    loadImage,
    insertYoutube,
    onClickColorOpen,
    onClickBgColorOpen
  } = useToolHeader()
  
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
          onClick={onClickColorOpen}
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
          onClick={onClickBgColorOpen}
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
})