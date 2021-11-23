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
  Link,
  Breadcrumbs,
  Collapse,
} from '@mui/material'
import { Icon } from '@components/Icon'
import { useGraphEditor } from '@hooks'
import { EVENT } from '@constants'
import { View, DataRender } from 'colay-ui'
import Form from '@rjsf/material-ui'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
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

const getId = (sidebarItem: SidebarItemData) => sidebarItem?.id ?? sidebarItem


export const PreferencesModal = (props: PreferencesModalProps) => {
  const {
    isOpen = true,
    sidebar = MOCK_SIDEBAR_DATA,
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
  // @ts-ignore
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
            style={{
              // width: '30%',
              marginRight: 4,
              flexDirection: 'row',
            }}
          >
            <Slide
              in
            >
              {drawer}
            </Slide>
            <Divider
              orientation="vertical"
              flexItem
            />
          </View>
          <View>
            <Breadcrumbs aria-label="breadcrumb">
              <Link
                color="inherit"
                href="/"
              >
                General
              </Link>
              <Typography color="text.primary">UI</Typography>
            </Breadcrumbs>
            {/* {components[]} */}
          </View>
        </View>
      </Paper>
    </Modal>
  )
}

const createDrawer = (sidebar: SidebarItemData[]) => (
  <View>
    {/* <Toolbar /> */}
    <Divider />
    <List>
      <DataRender
      // @ts-ignore
        data={sidebar}
        accessor={['children']}
        renderItem={(params) => {
          const {
            children,
          } = params
          const item = params.item as unknown as SidebarItemData
          return (
            <SidebarItem
              item={item}
            >
              {children}
            </SidebarItem>
          )
        }}
      />
    </List>
  </View>
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
  const item = (R.is(String)(propItem) ? {
    label: propItem,
  } : propItem) as Exclude<SidebarItemData, string>
  const hasChildren = !!item.items
  return (
    <>
      <ListItem
        button
        onClick={handleClick}
        selected={!hasChildren && open}
      >
        <ListItemIcon>
          {item.icon}
        </ListItemIcon>
        <ListItemText primary={item.label} />
        {hasChildren ? (open ? <ExpandLess /> : <ExpandMore />) : null}
      </ListItem>
      <Collapse
        in={open}
        timeout="auto"
        unmountOnExit
      >
        <List
          component="div"
          disablePadding
          sx={{ ml: 2 }}
        >
          {children}
        </List>
      </Collapse>
    </>
  )
}

const MOCK_SIDEBAR_DATA = [
  {
    id:  'General',
    icon: <Icon name="settings" />,
    label: 'General',
    items: [
      'UI',
    ],
  },
  {
    id:  'Bookmarks',
    icon: <Icon name="bookmark" />,
    label: 'Bookmarks',
    items: [
      {
        id:  'Filter',
        icon: <Icon name="filter" />,
        label: 'Filter',
        items: [
          'History',
        ],
      },
      'Text',
    ],
  },
]
