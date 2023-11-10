import React from 'react'
// @ts-ignore
import {JsonEditor as Editor} from 'jsoneditor-react'
import 'jsoneditor-react/es/editor.min.css'
import ace from 'brace'
import 'brace/mode/json'
import 'brace/theme/github'
import {useGraphEditor} from '@hooks'
import {EVENT} from '@constants'

export type JSONEditorProps = {}

export const JSONEditor = (props: JSONEditorProps) => {
  const [{item, onEvent}] = useGraphEditor(editor => ({
    item: editor.selectedItem,
    onEvent: editor.onEvent
  }))
  return (
    <>
      <Editor
        value={item?.data ?? {}}
        onChange={(newData: any) => {
          onEvent({
            type: EVENT.UPDATE_DATA,
            payload: {
              value: newData
            }
          })
        }}
        ace={ace}
        theme="ace/theme/github"
      />
    </>
  )
}
