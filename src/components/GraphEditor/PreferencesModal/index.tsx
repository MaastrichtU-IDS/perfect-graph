import {
  ColorPicker,
} from '@components/GraphEditor/ColorPicker'
import { Icon } from '@components/Icon'
import { EVENT } from '@constants'
import { useGraphEditor } from '@hooks'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import {
  Button,
  Collapse, Divider, List,
  ListItem,
  ListItemIcon,
  ListItemText, Modal,
  Paper, Slide, Typography,
} from '@mui/material'
import { Form } from '@components/Form'
import { DataRender, dataRenderPath, isReact, View } from 'colay-ui'
import { GraphConfig, FormProps } from '@type'
import { useImmer } from 'colay-ui/hooks/useImmer'
import * as R from 'colay/ramda'
import React from 'react'


type SidebarItemData = {
  label?: string;
  children?: SidebarItemData[];
  icon?: string;
  id: string
} | string

type NormalizedSidebarItemData = Exclude<SidebarItemData, string>

export type PreferencesModalProps = {
  isOpen?: boolean;
  sidebar?: SidebarItemData[];
  components?: Record<string, React.ReactNode | FormProps>;
}

const getId = (sidebarItem: NormalizedSidebarItemData) => sidebarItem?.id ?? sidebarItem

export const PreferencesModal = (props: PreferencesModalProps) => {
  const {
    sidebar: sidebar_ = DefaultSidebarData,
    components = DefaultComponents,
    isOpen = false,
  } = props

  const [
    {
      onEvent,
      graphConfig,
    },
  ] = useGraphEditor(
    (editor) => ({
      onEvent: editor.onEvent,
      graphEditorLocalDataRef: editor.localDataRef,
      graphConfig: editor.graphConfig,
    }),
  )
  const sidebar = React.useMemo(() => {
    const normalize = (sidebar: SidebarItemData): SidebarItemData => {
      if (typeof sidebar === 'string') {
        return {
          id: sidebar,
          label: sidebar,
        }
      }
      return {
        label: sidebar.id,
        ...sidebar,
        children: sidebar.children?.map((item) => normalize(item)),
      }
    }
    // @ts-ignore
    return sidebar_?.map((item) => normalize(item)) ?? []
  }, [sidebar_])
  const [
    initialComponentId,
    initialSelectedPath,
  ] = React.useMemo(()=>{
    const selectedPath = getSelectedPath(
      sidebar[0], 
      [getId(sidebar[0] as NormalizedSidebarItemData)],
    )
    const selectedItem = dataRenderPath(
      ['children'],
      selectedPath, 
      sidebar,
    ) as unknown as NormalizedSidebarItemData
    const componentId = getId(selectedItem)
    return [componentId, selectedPath]
  }, [])
  const [state, update] = useImmer({
    componentId: initialComponentId,
    selectedPath: initialSelectedPath,
  })

  const onSelect = React.useCallback((path: string[]) => {
    const item = dataRenderPath(
      ['children'], 
      path, 
      sidebar,
    ) as unknown as NormalizedSidebarItemData
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
  let form = components[state.componentId] as FormProps
  // @ts-ignore
  const isComponent = isReact.compatible(Component)
  if (!isComponent && components[state.componentId]) {
    // @ts-ignore
    form = (components[state.componentId]!)(graphConfig)
  }
  const isExist = components[state.componentId]
  const onSubmitCallback = ({ formData }: { formData: any }) => {
    onEvent({
      type: EVENT.PREFERENCES_FORM_SUBMIT,
      payload: {
        value: formData,
        preferenceId: state.componentId,
        preferencePath: state.selectedPath,
      },
    })
  }
  const onClearCallback = ({ formData }: { formData: any }) => {
    onEvent({
      type: EVENT.PREFERENCES_FORM_CLEAR,
      payload: {
        value: formData,
        preferenceId: state.componentId,
        preferencePath: state.selectedPath,
      },
    })
  }
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
            flex: 1,
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
              width: '97%',
              height: '97%',
              overflow: 'scroll',
              padding: 2,
            }}
          >
            <Form
              {...form}
              // @ts-ignore
              style={{
                width: '100%',
                height: '100%',
              }}
              schema={form.schema}
              onSubmit={onSubmitCallback}
              onClear={onClearCallback}
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
        // @ts-ignore
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
  onSelect: (path: string[]) => void
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
  onSelect: (path: string[])=>void
  selectedPath: string[];
  path: string[];
}
const getSelectedPath = (item: SidebarItemData, path: string[] = []): string[] => {
  // @ts-ignore
  const firstChild = item?.children?.[0]
  if (firstChild) {
    return getSelectedPath(firstChild, [...path,  getId(firstChild)])
  }
  return path
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
  } : propItem) as NormalizedSidebarItemData
  const handleClick = () => {
    onSelect(getSelectedPath(propItem, path))
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

export const DefaultComponents = {
  NodeView: (graphConfig: GraphConfig) => ({
    schema: {
      'type': 'object',
      'properties': {
        'width': {
          title: 'Width',
          'type': 'number',
        },
        'height': {
          title: 'Height',
          'type': 'number',
        },
        'radius': {
          title: 'Radius',
          'type': 'number',
        },
        'fill': {
          title: 'Fill',
          'type': 'object',
          'properties': {
            'default': {
              title: 'Default',
              'type': 'number',
            },
            'hovered': {
              title: 'Hovered',
              'type': 'number',
            },
            'selected': {
              title: 'Selected',
              'type': 'number',
            },
            'edgeSelected': {
              title: 'Edge Selected',
              'type': 'number',
            },
          },
          'required': [
            'default',
            'hovered',
            'selected',
            'edgeSelected',
          ],
        },
        'labelVisible': {
          title: 'Label Visible',
          'type': 'boolean',
        },
      },
      'required': [
        'width',
        'height',
        'radius',
        'fill',
        'labelVisible',
      ],
    },
    uiSchema: {
      fill: {
        selected: {
          'ui:widget': ColorPicker,
        },
        hovered: {
          'ui:widget': ColorPicker,
        },
        edgeSelected: {
          'ui:widget': ColorPicker,
        },
        default: {
          'ui:widget': ColorPicker,
        },
      },
    },
    formData: R.omit(['ids'], graphConfig!.nodes!.view),
  }),
  EdgeView: (graphConfig: GraphConfig) => ({
    schema: {
      'type': 'object',
      'properties': {
        'width': {
          'title': 'Width',
          'type': 'number',
        },
        'alpha': {
          'title': 'Alpha',
          'type': 'number',
        },
        'lineType': {
          'title': 'Line Type',
          'type': 'string',
          'enum': [
            'line',
            'bezier',
            'segments',
          ],
          'enumNames': [
            'Line',
            'Bezier',
            'Segments',
          ],
        },
        'fill': {
          'title': 'Fill',
          'type': 'object',
          'properties': {
            'default': {
              title: 'Default',
              'type': 'number',
            },
            'hovered': {
              title: 'Hovered',
              'type': 'number',
            },
            'selected': {
              title: 'Selected',
              'type': 'number',
            },
            'nodeSelected': {
              title: 'Node Selected',
              'type': 'number',
            },
          },
          'required': [
            'default',
            'hovered',
            'selected',
            'nodeSelected',
          ],
        },
        'labelVisible': {
          title: 'Label Visible',
          'type': 'boolean',
        },
      },
      'required': [
        'width',
        'fill',
        'labelVisible',
      ],
    },
    uiSchema: {
      fill: {
        selected: {
          'ui:widget': ColorPicker,
        },
        hovered: {
          'ui:widget': ColorPicker,
        },
        nodeSelected: {
          'ui:widget': ColorPicker,
        },
        default: {
          'ui:widget': ColorPicker,
        },
      },
    },
    formData: R.omit(['ids'], graphConfig!.edges!.view),
  }),
  // GeneralUI: () => ({
  //   schema: {
  //     type: 'object',
  //     required: [
  //       'historyTabVisible',
  //       'playlistTabVisible',
  //     ],
  //     properties: {
  //       historyTabVisible: {
  //         type: 'boolean',
  //         title: 'History Tab Visible',
  //       },
  //       playlistTabVisible: {
  //         type: 'boolean',
  //         title: 'Playlist Tab Visible',
  //       },
  //     },
  //   },
  // }),
  // UI: () => <div>Visualization</div>,
  // Filter: () => <div>Filter</div>,
  // History: () => <div>History</div>,
  // Settings: () => <div>Settings</div>,
}

export const DefaultSidebarData = [
  {
    id:  'General',
    icon: <Icon name="settings" />,
    label: 'General',
    children: [
      // { id: 'GeneralUI' },
      { id: 'NodeView' },
      { id: 'EdgeView' },
    ],
  },
  // {
  //   id:  'Bookmarks',
  //   icon: <Icon name="bookmark" />,
  //   label: 'Bookmarks',
  //   children: [
  //     {
  //       id:  'Filter',
  //       icon: <Icon name="filter" />,
  //       label: 'Filter',
  //       children: [
  //         'History',
  //       ],
  //     },
  //     'Settings',
  //   ],
  // },
]

