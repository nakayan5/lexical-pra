import { FC, useState } from 'react'
import styled from 'styled-components'
import { RichTextEditor } from '@/components/parts/RichTextEditor'
import { useRecoilValue } from 'recoil'
import { editorState } from '@/recoil/editor'
import { Switch } from '@/components/parts/Switch'
import { useRouter } from 'next/router'
import { usePageview } from '@/hook/ga/use-page-view'

// ========================================================================
// View
// ========================================================================

const Wrap = styled.div`
  width: 1100px;
  margin: 0 auto;
  padding: 50px 0;
`

const Inner = styled.div`
  display: flex;
  justify-content: space-between;
`

const Left = styled.div`
  width: 800px;
`

const Right = styled.div`
  width: 250px;
`

const StateWrap = styled.div`
  width: 800px;
  overflow-wrap: break-word;
  word-break: break-all;
  margin-bottom: 20px;
  background-color: #fff;
`

const StateInner = styled.div`
  padding: 15px 10px;
  font-size: 12px;
`

const EditorWrap = styled.div`
  width: 100%;
`

const SwitchWrap = styled.div`
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
`

const Description = styled.p`
  margin-bottom: 10px;
  font-size: 12px;
  padding: 15px 10px;
  background-color: white;
  word-break: break-all;
`

const Item = styled.div`
  background-color: #dbdbdb;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 12px;
  text-align: center;
  font-weight: bold;

  &:hover {
    opacity: 0.7;
  }
`

// ========================================================================
// View
// ========================================================================

export const Top: FC = () => {
  const state = useRecoilValue(editorState)
  const [isSwitchActive, setIsSwitchActive] = useState(false)
  const router = useRouter()

  usePageview()

  return (
    <Wrap>
      {state.data && (
        <StateWrap>
          <RichTextEditor isReadonly={true} editorState={state.data} isMarkdown={false} />
        </StateWrap>
      )}

      <Inner>
        <Left>
          <StateWrap>
            <StateInner>
              引用のまま改行したい場合は Shift + Enter で改行できます。
              <br />
              listをネストしたい場合は Enter で改行後、tab でネストできます。
            </StateInner>
          </StateWrap>
          <EditorWrap>
            <RichTextEditor isReadonly={false} isMarkdown={isSwitchActive} />
          </EditorWrap>
        </Left>

        <Right>
          <SwitchWrap>
            <Switch
              isActive={isSwitchActive}
              onClick={() => setIsSwitchActive((props) => !props)}
            />
          </SwitchWrap>

          <Description>
            @lexical/react/LexicalMarkdownShortcutPluginを入れています。markdwon形式で書くと自動で変換されます。
            ただ機能として不十分なのでmarkdownを入れるとなると@lexical/markdownを使ってpluginを自作する必要がありそう。
            <br />
            <br />
            対応しているのは以下です。
            <br />
            <br />- 見出し
            <br />- リスト
            <br />- 引用
            <br />- 太字
            <br />- 打ち消し
            <br />- イタリック
            <br />- インラインコード
          </Description>

          <Item onClick={() => router.push('/test/')}>Testページへ</Item>
        </Right>
      </Inner>
    </Wrap>
  )
}
