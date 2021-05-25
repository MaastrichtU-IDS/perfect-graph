import React from 'react'
import Form from '@rjsf/material-ui'
import { getFetchSchema } from './constants'
import { Modal, Button, Box, Typography, TextField, Paper } from '@material-ui/core'

export type QueryBuilderProps = {
  query: any;
  onCreate: (newQuery: any) => void;
  onClose: () => void;
  isOpen: boolean;
}

export const QueryBuilder = (props: QueryBuilderProps) => {
  const {
    isOpen,
    onCreate,
    query,
    onClose,
    onStart,
    onFinish,
    onError,
  } = props

  const [state, setState] = React.useState(query)
  return (
    <Modal
      open={isOpen}
      // onClose={onClose}
      style={{
        display: 'flex',
        // flexDirection: 'column-reverse',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      BackdropProps={{
        // style: {
        //   backgroundColor: 'rgba(0, 0, 0, 0)',
        // },
        // onClick: () => {
        // },
      }}
    >
      <Paper style={{
        display: 'flex',
        flexDirection: 'column',
        width: '80%',
        height: '80%',
        padding: 10,
        overflow: 'scroll'
      }}
      >
        <Box
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10
          }}
        >
          <Typography variant="h6">Query Builder</Typography>
        </Box>
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Form
            schema={getFetchSchema({ onPopupPress: () => console.log('eyyyy') }).schema}
            uiSchema={getFetchSchema({ onPopupPress: () => console.log('eyyyy') }).uiSchema}
            onChange={e => setState(e.formData)}
            formData={state}
          />
        </Box>
        <Box
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Paper style={{
            display: 'flex',

            flexDirection: 'row', justifyContent: 'space-around', width: '40%'
          }}>
            <Button
              onClick={() => {
                onCreate(state)
              }}
              fullWidth
            >
              Create
            </Button>
            <Button
              color="secondary"
              onClick={onClose}
              fullWidth
            >
              Close
            </Button>
          </Paper>
        </Box>
      </Paper>
    </Modal>

  )

}