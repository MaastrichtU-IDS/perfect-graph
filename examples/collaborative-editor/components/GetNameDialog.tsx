import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import React from 'react';

export type GetNameDialogProps = { 
  onSubmit: (name: string) => void;
}

export const  GetNameDialog = (props: GetNameDialogProps) => {
  const {
    onSubmit,
  } = props
  const [name, setName] = React.useState('');
  return (
      <Dialog open={true}>
        <DialogTitle>Set Your Name</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContentText> */}
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="User name"
            fullWidth
            variant="standard"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onSubmit(name)}>Start</Button>
        </DialogActions>
      </Dialog>
  );
}