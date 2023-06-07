import { AutoLinkPlugin } from '@lexical/react/LexicalAutoLinkPlugin'
import { FC } from 'react'

// 公式で実装されていた正規表現です
const URL_MATCHER =
  /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/

const EMAIL_MATCHER =
  /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/

const MATCHERS = [
  (text: string) => {
    const match = URL_MATCHER.exec(text)
    return (
      match && {
        index: match.index,
        length: match[0].length,
        text: match[0],
        url: match[0],
      }
    )
  },
  (text: string) => {
    const match = EMAIL_MATCHER.exec(text)
    return (
      match && {
        index: match.index,
        length: match[0].length,
        text: match[0],
        url: `mailto:${match[0]}`,
      }
    )
  },
]

/**
 * lexicalに用意されているLexicalAutoLinkPluginにロジックを追加するだけでLinkとしてレンダリングされます。
 */

export const AutoLink: FC = () => {
  return <AutoLinkPlugin matchers={MATCHERS} />
}
