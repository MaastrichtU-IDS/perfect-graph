import React from 'react'
import {
  Modal,
  Paper,
  Typography,
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@material-ui/core'
import MailIcon from '@material-ui/icons/Mail'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import { useGraphEditor } from '@hooks'
import { EVENT } from '@constants'
import { View } from 'colay-ui'

export type PreferencesModalProps = {
  isOpen?: boolean;
}

export const PreferencesModal = (props: PreferencesModalProps) => {
  const {
    isOpen = false,
    sidebar,
    components,
  } = props
  const [
    {
      onEvent,
    },
  ] = useGraphEditor(
    (editor) => ({
      onEvent: editor.onEvent,
    }),
  )
  const drawer = React.useMemo(() => createDrawer(), [sidebar, components])
  return (
    <Modal
      open={isOpen}
      onClose={() => onEvent({
        type: EVENT.TOGGLE_PREFERENCES_MODAL,
      })}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '80vw',
          height: '80vh',
        }}
      >
        <View>
          <Typography variant="h6">Preferences</Typography>
        </View>
        <Box sx={{ display: 'flex' }}>
          <Box
            // component="nav"
        // sx={{ width: { sm: '' }, flexShrink: { sm: 0 } }}
            // style={{ width: '20%' }}
          >
            <Drawer
              variant="permanent"
              sx={{
                display: { sm: 'block' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: '20%' },
              }}
              open
            >
              {drawer}
            </Drawer>
          </Box>
          <Box
            component="main"
            sx={{ flexGrow: 1, p: 3 }}
          >
            <Toolbar />
            <Typography paragraph>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non
              enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus
              imperdiet. Semper risus in hendrerit gravida rutrum quisque non tellus.
              Convallis convallis tellus id interdum velit laoreet id donec ultrices.
              Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
              adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra
              nibh cras. Metus vulputate eu scelerisque felis imperdiet proin fermentum
              leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis
              feugiat vivamus at augue. At augue eget arcu dictum varius duis at
              consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa
              sapien faucibus et molestie ac.
            </Typography>
            <Typography paragraph>
              Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper
              eget nulla facilisi etiam dignissim diam. Pulvinar elementum integer enim
              neque volutpat ac tincidunt. Ornare suspendisse sed nisi lacus sed viverra
              tellus. Purus sit amet volutpat consequat mauris. Elementum eu facilisis
              sed odio morbi. Euismod lacinia at quis risus sed vulputate odio. Morbi
              tincidunt ornare massa eget egestas purus viverra accumsan in. In hendrerit
              gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem
              et tortor. Habitant morbi tristique senectus et. Adipiscing elit duis
              tristique sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis
              eleifend. Commodo viverra maecenas accumsan lacus vel facilisis. Nulla
              posuere sollicitudin aliquam ultrices sagittis orci a.
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Modal>
  )
}

const createDrawer = () => (
  <div>
    <Toolbar />
    <Divider />
    <List>
      {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
        <ListItem
          button
          key={text}
        >
          <ListItemIcon>
            {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
          </ListItemIcon>
          <ListItemText primary={text} />
        </ListItem>
      ))}
    </List>
    <Divider />
    <List>
      {['All mail', 'Trash', 'Spam'].map((text, index) => (
        <ListItem
          button
          key={text}
        >
          <ListItemIcon>
            {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
          </ListItemIcon>
          <ListItemText primary={text} />
        </ListItem>
      ))}
    </List>
  </div>
)
