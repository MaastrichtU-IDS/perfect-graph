import React from 'react'
import {
  Modal,
} from '@material-ui/core'
import { useGraphEditor } from '@hooks'
import {  } from '@constants'

export type PreferencesModalProps = {
  isOpen?: boolean;
}

export const PreferencesModal = (props: PreferencesModalProps) => {
  const {
    isOpen = false
  } = props
  const [
    {
      onEvent,
    },
  ] = useGraphEditor(
    (editor) => {
      return {
        onEvent: editor.onEvent,
      }
    },
  )
  return (
    <Modal
      open={isOpen}
      onClose={() => onEvent({

      })}
      style={{
        display: 'flex',
        flexDirection: 'column-reverse',
      }}
      >

      </Modal>
  )
}
