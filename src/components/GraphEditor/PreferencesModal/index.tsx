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

export const PreferencesModal = (props: PreferencesModalProps) => {
  const {
    sidebar: sidebar_ = MOCK_SIDEBAR_DATA,
    components = MOCK_COMPONENTS,
    isOpen = false,
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
  const isComponent = isReact.compatible(Component)
  const isExist = components[state.componentId]
  const onSubmitCallback = ({ formData }) => {
    onEvent({
      type: EVENT.ELEMENT_SETTINGS_FORM_SUBMIT,
      payload: {
        name: state.componentId,
        value: formData,
        preferenceId: state.componentId,
        preferencePath: state.selectedPath,
      },
    })
  }
  console.log(state.componentId, state.selectedPath, isExist,
    isComponent, Component, form)
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
          height: '95%',
        }}
      >
        <View
          style={{
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
        <View
          style={{
            maxWidth: '70%',
          }}
        >
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
      isExist && (
        !isComponent ? (
          <Paper
            style={{
              width: '80%',
              height: '90%',
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
              schema={form.schema}
              onSubmit={onSubmitCallback}
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
      )
      }
        </View>
      </View>
    </Paper>
    </Modal>
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
            console.log('DATARENDER', params)
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
  General:{
    schema: {
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
    },
  },
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
  UI: () => <div>Visualization</div>,
  Filter: () => <div>Filter</div>,
  History: () => <div>History</div>,
  Settings: () => <div>Settings</div>,
}

const MOCK_SIDEBAR_DATA = [
  {
    id:  'General',
    icon: <Icon name="settings" />,
    label: 'General',
    children: [
      'UI',
    ],
  },
  {
    id:  'Bookmarks',
    icon: <Icon name="bookmark" />,
    label: 'Bookmarks',
    children: [
      {
        id:  'Filter',
        icon: <Icon name="filter" />,
        label: 'Filter',
        children: [
          'History',
        ],
      },
      'Settings',
    ],
  },
]

