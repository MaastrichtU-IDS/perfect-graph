import React from 'react'
import {
  Modal,
  Button,
  Paper,
} from '@material-ui/core'
import { FormProps } from '@rjsf/core'
import Form from '@rjsf/material-ui'
import * as R from 'colay/ramda'
// import {
//   View,
// } from 'colay-ui'

export type ModalComponentProps = {
  isOpen?: boolean;
  render?: () => React.ReactElement;
  form?: FormProps<any>
  onClose?: () => void
}

export const ModalComponent = (props: ModalComponentProps) => {
  const {
    isOpen = false,
    render,
    form,
    onClose = () => {},
  } = props
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      onBackdropClick={onClose}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {
      form
        ? (
          <Paper
            style={{
              maxWidth: '80%',
              maxHeight: '90%',
              overflow: 'scroll',
              padding: 2,
            }}
          >
            <Form
              {...form}
              schema={R.omit(['title'])(form.schema)}
            >
              {
              form.children ?? (
              <Button
                type="submit"
                fullWidth
                variant="contained"
              >
                Apply
              </Button>
              )
}
            </Form>
          </Paper>
        )
        : (render?.() ?? null)
      }

    </Modal>
  )
}
