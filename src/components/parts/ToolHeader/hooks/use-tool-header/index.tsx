import { getSelectedNode } from "@/utils"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $getSelection, $isRangeSelection, ElementNode, GridSelection, NodeSelection, RangeSelection, SELECTION_CHANGE_COMMAND, TextNode } from "lexical"
import { useCallback, useEffect, useState } from "react"
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'
import { $createHeadingNode, $createQuoteNode, $isHeadingNode, HeadingTagType } from "@lexical/rich-text"
import { $patchStyleText, $wrapLeafNodesInElements } from "@lexical/selection"
import { INSERT_IMAGE_COMMAND } from '@/plugins/ImagePlugin'
import { INSERT_YOUTUBE_COMMAND } from '@/plugins/YouTubePlugin'
import { mergeRegister } from "@lexical/utils"
import { LowPriority } from "../../constants"
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from "@lexical/list"


type THeadingTagType = Extract<HeadingTagType, 'h1' | 'h2'>

const youtubeId = 'UcxNBBtjDOM'


export const useToolHeader = () => {
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
  
  
    const setLink = useCallback((selectNode: RangeSelection) => {
      const node: TextNode | ElementNode | undefined = getSelectedNode(selectNode) // textを取得
  
      if (!node) return
  
      const parent: ElementNode | null = node.getParent() // paragraphを取得 (TreeViewとlog()を見てもらえると分かりやすいです)
    
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
    const formatBulletList = useCallback(() => {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, '')
    }, [])
  
    // numberリストに変換
    const formatNumberList = useCallback(() => {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, '')
    }, [])
  
    // textの色を変更
    const changeTextColor = useCallback(
      (style: { color: string }) => {
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
      (style: { 'background-color': string }) => {
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


    return {
        editor,
        isBold,
        isItalic,
        isUnderline,
        isStrikethrough,
        isLeft, 
        isCenter,
        isRight,
        isTextColorOpen,
        isBackgroundColorOpen,
        blockType, 
        isLink,
        insertLink,
        changeBackgroundColor,
        changeTextColor,
        formatBulletList,
        formatNumberList,
        formatQuote,
        formatHeading,
        loadImage,
        insertYoutube,
        onClickColorOpen: () => setIsTextColorOpen((props) => !props),
        onClickBgColorOpen: () => setIsBackgroundColorOpen((props) => !props)
    }
}