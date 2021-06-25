import React from 'react'
import Form from '@rjsf/material-ui'
import { getQueryBuilderSchema } from './constants'
import * as API from './API'
import { Modal, Button, Box, Typography, TextField, Paper } from '@material-ui/core'

export type QueryBuilderProps = {
  query: any;
  onStart: () => void;
  onError: () => void;
  onFinish: (data: any) => void;
  onClose: () => void;
  isOpen: boolean;
}

const prepareData = (data) => {
  const {
    nodes,
    edges
  } = data
  const preNodes = R.splitEvery(Math.ceil(nodes.length / CHUNK_COUNT))(nodes)[0]
  const preEdges = filterEdges(preNodes)(edges)
  return {
    nodes: preNodes,
    edges: preEdges
  }
}

export const QueryBuilder = (props: QueryBuilderProps) => {
  const {
    isOpen,
    onStart,
    onError,
    onFinish,
    query,
    onClose
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
            schema={getQueryBuilderSchema().schema}
            uiSchema={getQueryBuilderSchema().uiSchema}
            onChange={e => setState(e.formData)}
            formData={state}
            onSubmit={async e => {
              onStart()
              
              try {
                let casesData = await API.listCases(e.formData)
                // let casesData = prepareData(cases)
                
                onFinish({
                  nodes: casesData.nodes,
                  edges: casesData.edges
                })
              } catch (e) {
                console.log(e)
                onError()
              }
            }}
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