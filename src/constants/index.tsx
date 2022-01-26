// import { Icon, Text, TouchableOpacity } from 'unitx-ui'
import Layouts from '@core/layouts'
import { EventInfo, NodeConfig, EdgeConfig } from '@type'
import { DefaultTheme } from '@core/theme'

export const THEME = {
  backgroundColor: '#3287a8',
  fillColor: 'rgb(153, 153, 153)'
  ,
}
export const ELEMENT_TYPE = {
  EDGE: 'EDGE',
  NODE: 'NODE',
} as const

export const EVENT = {
  ADD_CLUSTER_ELEMENT: 'ADD_CLUSTER_ELEMENT',
  ADD_DATA_ADDITIONAL: 'ADD_DATA_ADDITIONAL',
  ADD_DATA_VALUE_ADDITIONAL: 'ADD_DATA_VALUE_ADDITIONAL',
  ADD_DATA_VALUE: 'ADD_DATA_VALUE',
  ADD_DATA: 'ADD_DATA',
  ADD_EDGE: 'ADD_EDGE',
  ADD_NODE: 'ADD_NODE',
  APPLY_EVENTS: 'APPLY_EVENTS',
  APPLY_RECORDED_EVENTS: 'APPLY_RECORDED_EVENTS',
  BOX_SELECTION: 'BOX_SELECTION',
  CALCULATE_GLOBAL_NETWORK_STATISTICS: 'CALCULATE_GLOBAL_NETWORK_STATISTICS',
  CALCULATE_LOCAL_NETWORK_STATISTICS: 'CALCULATE_LOCAL_NETWORK_STATISTICS',
  CHANGE_CLUSTER_VISIBILITY: 'CHANGE_CLUSTER_VISIBILITY',
  CHANGE_DATA_NAME_ADDITIONAL: 'CHANGE_DATA_NAME_ADDITIONAL',
  CHANGE_DATA_NAME: 'CHANGE_DATA_NAME',
  CHANGE_DATA_TYPE: 'CHANGE_DATA_TYPE',
  CHANGE_DATA_VALUE_ADDITIONAL: 'CHANGE_DATA_VALUE_ADDITIONAL',
  CHANGE_DATA_VALUE: 'CHANGE_DATA_VALUE',
  CHANGE_THEME: 'CHANGE_THEME',
  CLEAR_NODE_GLOBAL_LABEL: 'CLEAR_NODE_GLOBAL_LABEL',
  CLEAR_NODE_LOCAL_LABEL: 'CLEAR_NODE_LOCAL_LABEL',
  CLOSE_MODAL: 'CLOSE_MODAL',
  CREATE_CLUSTER_BY_ALGORITHM_FORM_CLEAR: 'CREATE_CLUSTER_BY_ALGORITHM_FORM_CLEAR',
  CREATE_CLUSTER_BY_ALGORITHM_FORM_SUBMIT: 'CREATE_CLUSTER_BY_ALGORITHM_FORM_SUBMIT',
  CREATE_CLUSTER_BY_ALGORITHM: 'CREATE_CLUSTER_BY_ALGORITHM',
  CREATE_CLUSTER_FORM_SUBMIT: 'CREATE_CLUSTER_FORM_SUBMIT',
  CREATE_CLUSTER: 'CREATE_CLUSTER',
  CREATE_PLAYLIST: 'CREATE_PLAYLIST',
  DEFOCUS: 'DEFOCUS',
  DATA_VALUE_DOWN: 'DATA_VALUE_DOWN',
  DATA_VALUE_UP: 'DATA_VALUE_UP',
  DELETE_CLUSTER_ELEMENT: 'DELETE_CLUSTER_ELEMENT',
  DELETE_CLUSTER: 'DELETE_CLUSTER',
  DELETE_DATA_ADDITIONAL: 'DELETE_DATA_ADDITIONAL',
  DELETE_DATA_VALUE_ADDITIONAL: 'DELETE_DATA_VALUE_ADDITIONAL',
  DELETE_DATA_VALUE: 'DELETE_DATA_VALUE',
  DELETE_DATA: 'DELETE_DATA',
  DELETE_EDGE: 'DELETE_EDGE',
  DELETE_HISTORY_ITEM: 'DELETE_HISTORY_ITEM',
  DELETE_NODE: 'DELETE_NODE',
  DELETE_PLAYLIST: 'DELETE_PLAYLIST',
  ELEMENT_SELECTED_WITH_ZOOM: 'ELEMENT_SELECTED_WITH_ZOOM',
  ELEMENT_SELECTED: 'ELEMENT_SELECTED',
  ELEMENT_SETTINGS: 'ELEMENT_SETTINGS',
  ELEMENT_SETTINGS_FORM_SUBMIT: 'ELEMENT_SETTINGS_FORM_SUBMIT',
  ELEMENT_SETTINGS_FORM_CLEAR: 'ELEMENT_SETTINGS_FORM_CLEAR',
  EXPORT_DATA: 'EXPORT_DATA',
  FOCUS: 'FOCUS',
  IMPORT_DATA: 'IMPORT_DATA',
  IMPORT_EVENTS: 'IMPORT_EVENTS',
  LAYOUT_ANIMATION_DURATION_CHANGED: 'LAYOUT_ANIMATION_DURATION_CHANGED',
  LAYOUT_CHANGED: 'LAYOUT_CHANGED',
  LAYOUT_FORM_CLEAR: 'LAYOUT_FORM_CLEAR',
  MAKE_DATA_LABEL_FIRST: 'MAKE_DATA_LABEL_FIRST',
  MAKE_DATA_LABEL: 'MAKE_DATA_LABEL',
  MAKE_GLOBAL_DATA_LABEL_FIRST: 'MAKE_GLOBAL_DATA_LABEL_FIRST',
  MAKE_GLOBAL_DATA_LABEL: 'MAKE_GLOBAL_DATA_LABEL',
  MODE_CHANGED: 'MODE_CHANGED',
  PLAY_EVENTS: 'PLAY_EVENTS',
  PREFERENCES_FORM_CLEAR: 'PREFERENCES_FORM_CLEAR',
  PREFERENCES_FORM_SUBMIT: 'PREFERENCES_FORM_SUBMIT',
  PRESS_ADD_CLUSTER_ELEMENT: 'PRESS_ADD_CLUSTER_ELEMENT',
  PRESS_BACKGROUND: 'PRESS_BACKGROUND',
  RECORD_FINISHED: 'RECORD_FINISHED',
  REDO_EVENT: 'REDO_EVENT',
  REORDER_CLUSTER: 'REORDER_CLUSTER',
  REORDER_HISTORY_ITEM: 'REORDER_HISTORY_ITEM',
  REORDER_PLAYLIST: 'REORDER_PLAYLIST',
  SELECT_CLUSTER: 'SELECT_CLUSTER',
  SET_NODE_GLOBAL_LABEL: 'SET_NODE_GLOBAL_LABEL',
  SET_NODE_LOCAL_LABEL: 'SET_NODE_LOCAL_LABEL',
  SET_POSITIONS_IMPERATIVELY: 'SET_POSITIONS_IMPERATIVELY',
  SETTINGS_FORM_CHANGED: 'SETTINGS_FORM_CHANGED',
  SETTINGS_FORM_CLEAR: 'SETTINGS_FORM_CLEAR',
  TOGGLE_ACTION_BAR: 'TOGGLE_ACTION_BAR',
  TOGGLE_DATA_BAR: 'TOGGLE_DATA_BAR',
  TOGGLE_FILTER_BAR: 'TOGGLE_FILTER_BAR',
  TOGGLE_NODE_GLOBAL_LABEL_FIRST: 'TOGGLE_NODE_GLOBAL_LABEL_FIRST',
  TOGGLE_PREFERENCES_MODAL: 'TOGGLE_PREFERENCES_MODAL',
  TOGGLE_RECORD_ACTIONS: 'TOGGLE_RECORD_ACTIONS',
  TOGGLE_RECORD_EVENTS: 'TOGGLE_RECORD_EVENTS',
  TOGGLE_RECORD: 'TOGGLE_RECORD',
  UNDO_EVENT: 'UNDO_EVENT',
  UPDATE_DATA: 'UPDATE_DATA',
} as const

export const ELEMENT_DATA_FIELDS = {
  POSITION: 'position',
  ID: 'id',
  DATA: 'data',
  CONTEXT: '__context',
} as const

export const EDITOR_MODE = {
  ADD: 'ADD',
  DELETE: 'DELETE',
  CONTINUES_ADD: 'CONTINUES_ADD',
  CONTINUES_DELETE: 'CONTINUES_DELETE',
  DEFAULT: 'DEFAULT',
  ADD_CLUSTER_ELEMENT: 'ADD_CLUSTER_ELEMENT',
} as const

export const DATA_TYPE = {
  number: 'number',
  string: 'string',
  id: 'id',
  unknown: 'unknown',
} as const

export const DATA_TYPE_BY_INDEX = [
  'string',
  'number',
  'id',
  'unknown',
] as const

export const LAYOUT_NAMES = Object.keys(Layouts)



export const SIDE_PANEL_DEFAULT_WIDTH = 260
export const SIDE_PANEL_DEFAULT_HEIGHT = 530
// export const eventHandlers = [
//   'click',
//   'mousedown',
//   'mousemove',
//   'mouseout',
//   'mouseover',
//   'mouseup',
//   'mouseupoutside',
//   'tap',
//   'touchstart',
//   'touchmove',
//   'touchend',
//   'touchendoutside',
//   'pointercancel',
//   'pointerout',
//   'pointerover',
//   'pointertap',
//   'pointerdown',
//   'pointerup',
//   'pointerupoutside',
//   'pointermove',
//   'rightclick',
//   'rightdown',
//   'rightup',
//   'rightupoutside',
//   'touchcancel',
//   'touchendoutside',
//   'touchmove',
//   'touchstart',
// ]

export const CYTOSCAPE_EVENT = {
  select: 'select',
  unselect: 'unselect',
  position: 'position',
  selectEdge: 'selectEdge',
  unselectEdge: 'unselectEdge',
  selectNode: 'selectNode',
  unselectNode: 'unselectNode',
  data: 'data',
  mouseover: 'mouseover',
  mouseout: 'mouseout',
} as const
export const EDGE_LINE_Z_INDEX = -100
export const EDGE_CONTAINER_Z_INDEX = -99

export const MOCK_DATA = {
  events: [{
    type: 'ELEMENT_SELECTED', elementId: 'http://deeplink.rechtspraak.nl/uitspraak?id=ECLI:NL:HR:2007:BB5172', event: { data: { originalEvent: { metaKey: false } } }, id: '97a3057d-8e8a-437a-8180-13382e4d05a0', date: '2021-03-05T12:24:25.666Z',
  }, {
    type: 'PRESS_BACKGROUND', payload: { x: 2447.24609375, y: 1719.8828125 }, id: '7160a81a-85cc-493a-9ba5-5b515c4e260d', date: '2021-03-05T12:24:26.238Z', event: {},
  }, {
    type: 'ELEMENT_SELECTED', elementId: 'http://deeplink.rechtspraak.nl/uitspraak?id=ECLI:NL:HR:2013:BZ1717', event: { data: { originalEvent: { metaKey: false } } }, id: '78e7c6c2-11a4-431d-9662-99713fc8df41', date: '2021-03-05T12:24:27.128Z',
  }, {
    type: 'PRESS_BACKGROUND', payload: { x: 2928.828125, y: 1769.6484375 }, id: '83ea6691-70c5-4f6a-b389-bbdc46181c6c', date: '2021-03-05T12:24:27.643Z', event: {},
  }, {
    type: 'ELEMENT_SELECTED', elementId: 'http://deeplink.rechtspraak.nl/uitspraak?id=ECLI:NL:HR:2011:BR5215', event: { data: { originalEvent: { metaKey: false } } }, id: 'f522d845-000a-4583-9355-16c56cbd0d66', date: '2021-03-05T12:24:28.695Z',
  }] as EventInfo[],
}

export const  QUALITY_LEVEL = {
  HIGH: 2,
  MEDIUM: 1,
  LOW: 0,
} as const

export const DEFAULT_NODE_CONFIG: NodeConfig = {
  view: {
    width: 50,
    height: 50,
    radius: 50,
    fill: {
      default: DefaultTheme.palette.background.paper,
      hovered: DefaultTheme.palette.secondary.main,
      selected: DefaultTheme.palette.primary.main,
      edgeSelected: DefaultTheme.palette.secondary.main,
    },
    labelVisible: true,
  },
  filter: {
    settings: {
      opacity: 0.2,
    },
    // test: () => true,
  },
  renderEvents: [
    CYTOSCAPE_EVENT.select,
    CYTOSCAPE_EVENT.unselect,
    CYTOSCAPE_EVENT.selectEdge,
    CYTOSCAPE_EVENT.unselectEdge,
    CYTOSCAPE_EVENT.mouseover,
    CYTOSCAPE_EVENT.mouseout,
  ],
}

export const DEFAULT_EDGE_CONFIG: EdgeConfig = {
  view: {
    lineType: 'line',
    width: 2,
    alpha: 1,
    fill: {
      default: DefaultTheme.palette.background.paper,
      hovered: DefaultTheme.palette.secondary.main,
      selected: DefaultTheme.palette.primary.main,
      nodeSelected: DefaultTheme.palette.secondary.main,
    },
    labelVisible: true,
  },
  filter: {
    settings: {
      opacity: 0.2,
    },
  },
  renderEvents: [
    CYTOSCAPE_EVENT.select,
    CYTOSCAPE_EVENT.unselect,
    CYTOSCAPE_EVENT.selectNode,
    CYTOSCAPE_EVENT.unselectNode,
    CYTOSCAPE_EVENT.mouseover,
    CYTOSCAPE_EVENT.mouseout,
  ],
}