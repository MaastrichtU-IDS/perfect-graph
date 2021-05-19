import React from 'react'
import {
  Modal,
  Paper,
  Typography,
  Divider,
  Slide,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Collapse,
} from '@material-ui/core'
import MailIcon from '@material-ui/icons/Mail'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import { useGraphEditor } from '@hooks'
import { EVENT } from '@constants'
import { View, DataRender } from 'colay-ui'
import Form from '@rjsf/material-ui'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import * as R from 'colay/ramda'

type SidebarItemData = {
  label: string;
  items?: SidebarItemData[];
  icon?: string;
} | string

export type PreferencesModalProps = {
  isOpen?: boolean;
  sidebar?: SidebarItemData[];
  components?: Record<string, React.ReactNode>;
}

export const PreferencesModal = (props: PreferencesModalProps) => {
  const {
    isOpen = false,
    sidebar = [
      {
        icon: <MailIcon />,
        label: 'Perfect Graph',
        items: [
          'perfect-graph/introduction',
          'perfect-graph/design-principles',
          'perfect-graph/contributing',
        ],
      },
      {
        icon: <InboxIcon />,
        label: 'Getting Started',
        items: [
          {
            icon: <MailIcon />,
            label: 'Perfect Graph',
            items: [
              'perfect-graph/introduction',
              'perfect-graph/design-principles',
              'perfect-graph/contributing',
            ],
          },
          'Email',
        ],
      },
    ],
    components = {},
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
  const drawer = React.useMemo(() => createDrawer(sidebar), [sidebar, components])
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
        <View
          style={{
            flexDirection: 'row',
          }}
        >
          <View
            style={{ width: '30%'}}
          >
            <Slide
              in
            >
              {drawer}
            </Slide>
          </View>
          <View>
            <Toolbar />
            <Form
              schema={{
                title: 'A registration form',
                description: 'A simple form example.',
                type: 'object',
                required: [
                  'firstName',
                  'lastName',
                ],
                properties: {
                  firstName: {
                    type: 'string',
                    title: 'First name',
                    default: 'Chuck',
                  },
                  lastName: {
                    type: 'string',
                    title: 'Last name',
                  },
                  telephone: {
                    type: 'string',
                    title: 'Telephone',
                    minLength: 10,
                  },
                },
              }}
              // onSubmit={onSubmitCallback}
            />
          </View>
        </View>
      </Paper>
    </Modal>
  )
}

const createDrawer = (sidebar: SidebarItemData[]) => (
  <div>
    <Toolbar />
    <Divider />
    <List>
      <DataRender
        data={sidebar}
        accessor={['items']}
        renderItem={({ item, children }) => (
          <SidebarItem
            item={item}
          >
            {children}
          </SidebarItem>
        )}
      />
    </List>
  </div>
)

type SidebarItemProps = {
  item: SidebarItemData;
  children: React.ReactNode;
}
const SidebarItem = (props: SidebarItemProps) => {
  const {
    children,
    item: propItem,
  } = props
  const [open, setOpen] = React.useState(false)
  const handleClick = () => {
    setOpen(!open)
  }
  const item = R.is(String)(propItem) ? {
    label: propItem,
  } : propItem
  return (
    <>
      <ListItem
        button
        sx={{ pl: 4 }}
        onClick={handleClick}
      >
        <ListItemIcon>
          {item.icon}
        </ListItemIcon>
        <ListItemText primary={item.label} />
        {item.items ? (open ? <ExpandLess /> : <ExpandMore />) : null}
      </ListItem>
      <Collapse
        in={open}
        timeout="auto"
        unmountOnExit
      >
        <List
          component="div"
          disablePadding
        >
          {children}
        </List>
      </Collapse>
    </>
  )
}
