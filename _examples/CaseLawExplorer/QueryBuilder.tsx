import React from 'react'
import { Modal, Button, Box, Typography, TextField, Paper} from '@material-ui/core'

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
        padding: 10
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
            flexDirection: 'column',
            width: '100%',
            height: '80%',
          }}
        >
          <TextField 
            label="QueryType"
            onChange={(e)=> setState({...state, type: e.target.value})}
            value={state.type}
          />
          <TextField 
            label="QueryValue"
            onChange={(e)=> setState({...state, value: e.target.value})}
            value={state.value}
          />
          <TextField 
            label="QueryMode"
            onChange={(e)=> setState({...state, mode: e.target.value})}
            value={state.mode}
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
          <Paper style={{ display: 'flex', 
          
          flexDirection: 'row', justifyContent: 'space-around' , width: '40%'}}>
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