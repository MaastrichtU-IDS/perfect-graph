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
} from '@material-ui/core'
import { Icon } from '@components/Icon'
import { useGraphEditor } from '@hooks'
import { EVENT } from '@constants'
import { View, DataRender } from 'colay-ui'
import Form from '@rjsf/material-ui'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import * as R from 'colay/ramda'
import { useImmer } from 'colay-ui/hooks/useImmer'

type SidebarItemData = {
  label: string;
  children?: SidebarItemData[];
  icon?: string;
  id: string
} | string

export type PreferencesModalProps = {
  isOpen?: boolean;
  sidebar?: SidebarItemData[];
  components?: Record<string, React.ReactNode>;
}

const getId = (sidebarItem: SidebarItemData) => sidebarItem?.id ?? sidebarItem
export const dataRenderPath = (accessor: string[], selectedPath: string[], data: any[]) => {
  let result
  const find = (children, currentPath = []) => {
    const foundItem = Object.values(children).find((child) => {
      const newPath = [...currentPath, child.id]
      if (R.equals(newPath, selectedPath)) {
        result = child
        return true
      }
      return find(R.path(accessor, child) ?? [], newPath)
    })
    return foundItem
  }
  find(data)
  return result
}

export const ElementSettingsModal = (props: PreferencesModalProps) => {
  const {
    sidebar: sidebar_ = MOCK_SIDEBAR_DATA,
    components = MOCK_COMPONENTS,
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
  const sidebar = React.useMemo(() => {
    const normalize = (sidebar: SidebarItemData) => {
      if (typeof sidebar === 'string') {
        return {
          id: sidebar,
          label: sidebar,
        }
      }
      return {
        label: sidebar.id,
        ...sidebar,
        children: sidebar.children?.map((item) => normalize(item)) ?? [],
      }
    }
    return sidebar_?.map((item) => normalize(item)) ?? []
  }, [sidebar_])
  const [state, update] = useImmer({
    componentId: getId(sidebar[0]),
    selectedPath: [getId(sidebar[0])],
  })

  const onSelect = React.useCallback((path) => {
    const item = dataRenderPath(['children'], path, sidebar)
    update((draft) => {
      draft.selectedPath = path
      draft.componentId = getId(item)
    })
  }, [])

  // @ts-ignore
  const drawer = React.useMemo(() => createDrawer({
    sidebar,
    onSelect,
    selectedPath: state.selectedPath,
  }), [sidebar, components, state.selectedPath])
  const Component = components[state.componentId] ?? React.Fragment
  return (
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
          {/* <Breadcrumbs aria-label="breadcrumb">
            {
              R.dropLast(1, state.selectedPath).map((pathName) => (
                <Link
                  color="inherit"
                  href="/"
                >
                  {pathName}
                </Link>
              ))
            }
            <Typography color="text.primary">{R.last(state.selectedPath)}</Typography>
          </Breadcrumbs> */}
          <Component />
          {/* <Form
              schema={{
                type: 'object',
                required: [
                  'historyTabVisible',
                  'playlistTabVisible',
                ],
                properties: {
                  labelTextSize: {
                    type: 'number',
                    title: 'Label Text Size',
                  },
                  historyTabVisible: {
                    type: 'boolean',
                    title: 'History Tab Visible',
                  },
                  playlistTabVisible: {
                    type: 'boolean',
                    title: 'Playlist Tab Visible',
                  },
                },
              }}
              uiSchema={{
                'ui:options': {
                  label: false,
                },
              }}
              // onSubmit={onSubmitCallback}
            /> */}
        </View>
      </View>
    </Paper>
  )
}

type CreateDrawerParams = {
  sidebar: SidebarItemData[];
  onSelect: (name: string) => void
  selectedPath: string[]
}
const createDrawer = (params: CreateDrawerParams) => {
  const {
    sidebar,
    onSelect,
    selectedPath,
  } = params
  return (
    <View>
      {/* <Toolbar /> */}
      <Divider />
      <List>
        <DataRender
      // @ts-ignore
          data={sidebar}
          extraData={[selectedPath, onSelect]}
          accessor={['children']}
          renderItem={(params) => {
            const {
              children,
            } = params
            const item = params.item as unknown as SidebarItemData
            return (
              <SidebarItem
                item={item}
                onSelect={onSelect}
                path={params.path}
                selectedPath={selectedPath}
              >
                {children}
              </SidebarItem>
            )
          }}
        />
      </List>
    </View>
  )
}

type SidebarItemProps = {
  item: SidebarItemData;
  children: React.ReactNode;
  onSelect: (name: string)=>void
}
const SidebarItem = (props: SidebarItemProps) => {
  const {
    children,
    item: propItem,
    onSelect,
    path,
    selectedPath,
  } = props
  const [open, setOpen] = React.useState(false)
  const item = (R.is(String)(propItem) ? {
    label: propItem,
    id: propItem,
  } : propItem) as Exclude<SidebarItemData, string>
  const handleClick = () => {
    onSelect(path)
    setOpen(!open)
  }
  const hasChildren = !!item.children
  const selected = selectedPath.join('').includes(path.join(''))
  console.log(path, selectedPath, selected)
  return (
    <>
      <ListItem
        button
        onClick={handleClick}
        selected={selected}
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

const MOCK_COMPONENTS = {
  General: () => <div>General</div>,
  Visualization: () => <div>Visualization</div>,
  Filter: () => <div>Filter</div>,
  History: () => <div>History</div>,
  Settings: () => <div>Settings</div>,
}

const MOCK_SIDEBAR_DATA = [
  {
    icon: <Icon name="settings" />,
    id: 'General',
    children: [
      'UI',
    ],
  },
  {
    icon: <Icon name="bookmark" />,
    id: 'Visualization',
    children: [
      {
        icon: <Icon name="filter" />,
        id: 'Filter',
        children: [
          'History',
        ],
      },
      'Settings',
    ],
  },
]
