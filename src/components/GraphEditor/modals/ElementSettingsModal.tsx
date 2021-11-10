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
  Button,
  Collapse,
} from '@mui/material'
import { Icon } from '@components/Icon'
import { useGraphEditor } from '@hooks'
import { EVENT } from '@constants'
import {
  View, DataRender, dataRenderPath, isReact,
} from 'colay-ui'
import Form from '@rjsf/material-ui'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
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

export const ElementSettingsModal = (props: PreferencesModalProps) => {
  const {
    sidebar: sidebar_ = MOCK_SIDEBAR_DATA,
    components = MOCK_COMPONENTS,
  } = props

  const [
    {
      onEvent,
      graphEditorLocalDataRef,
    },
  ] = useGraphEditor(
    (editor) => ({
      onEvent: editor.onEvent,
      graphEditorLocalDataRef: editor.localDataRef,
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
  const form = components[state.componentId]
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
          {
      !isReact.compatible(Component)
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
              style={{
                width: '100%',
                height: '100%',
              }}
              schema={R.omit(['title'])(form.schema)}
              onSubmit={({ formData }) => {
                onEvent({
                  type: EVENT.ELEMENT_SETTINGS_FORM_SUBMIT,
                  payload: {
                    name: state.componentId,
                    value: formData,
                    itemIds: graphEditorLocalDataRef.current.contextMenu.itemIds,
                  },
                })
                graphEditorLocalDataRef.current.contextMenu.itemIds = []
              }}
            >
              {
              form.children ?? (
              <Button
                type="submit"
                fullWidth
                variant="contained"
              >
                Save
              </Button>
              )
}
            </Form>
          </Paper>
        )
        : <Component />
      }
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
  Visualization: {
    schema: {
      type: 'object',
      properties: {
        size: {
          title: 'Size',
          type: 'integer',
          minimum: 10,
          maximum: 50,
        },
        fontSize: {
          title: 'Font Size',
          type: 'integer',
          minimum: 10,
          maximum: 50,
        },
        backgroundColor: {
          type: 'string',
          title: 'color picker',
          default: '#151ce6',
        },
        textColor: {
          type: 'string',
          title: 'color picker',
          default: '#151ce6',
        },
      },
    },
    uiSchema: {
      size: {
        'ui:widget': 'range',
      },
      fontSize: {
        'ui:widget': 'range',
      },
      backgroundColor: {
        'ui:widget': 'color',
      },
      textColor: {
        'ui:widget': 'color',
      },
    },
  },
  // Visualization: () => <div>Visualization</div>,
  Filter: () => <div>Filter</div>,
  History: () => <div>History</div>,
  Settings: () => <div>Settings</div>,
}

const MOCK_SIDEBAR_DATA = [
  {
    icon: <Icon name="settings" />,
    id: 'General',
    children: [
      'Visualization',
    ],
  },
  // {
  //   icon: <Icon name="bookmark" />,
  //   id: 'Visualization',
  //   children: [
  //     {
  //       icon: <Icon name="filter" />,
  //       id: 'Filter',
  //       children: [
  //         'History',
  //       ],
  //     },
  //     'Settings',
  //   ],
  // },
]
