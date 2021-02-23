import React from 'react'
// import { Icon, Text, TouchableOpacity } from 'unitx-ui'
import Layouts from '@core/layouts'

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
  ELEMENT_SELECTED: 'ELEMENT_SELECTED',
  CHANGE_DATA_NAME: 'CHANGE_DATA_NAME',
  CHANGE_DATA_VALUE: 'CHANGE_DATA_VALUE',
  CHANGE_DATA_NAME_ADDITIONAL: 'CHANGE_DATA_NAME_ADDITIONAL',
  CHANGE_DATA_VALUE_ADDITIONAL: 'CHANGE_DATA_VALUE_ADDITIONAL',
  UPDATE_DATA: 'UPDATE_DATA',
  ADD_DATA: 'ADD_DATA',
  ADD_DATA_VALUE: 'ADD_DATA_VALUE',
  DATA_VALUE_UP: 'DATA_VALUE_UP',
  DATA_VALUE_DOWN: 'DATA_VALUE_DOWN',
  ADD_DATA_VALUE_ADDITIONAL: 'ADD_DATA_VALUE_ADDITIONAL',
  ADD_DATA_ADDITIONAL: 'ADD_DATA_ADDITIONAL',
  DELETE_DATA_ADDITIONAL: 'DELETE_DATA_ADDITIONAL',
  DELETE_DATA: 'DELETE_DATA',
  DELETE_DATA_VALUE: 'DELETE_DATA_VALUE',
  DELETE_DATA_VALUE_ADDITIONAL: 'DELETE_DATA_VALUE_ADDITIONAL',
  MAKE_DATA_LABEL: 'MAKE_DATA_LABEL',
  MAKE_DATA_LABEL_FIRST: 'MAKE_DATA_LABEL_FIRST',
  MAKE_GLOBAL_DATA_LABEL: 'MAKE_GLOBAL_DATA_LABEL',
  MAKE_GLOBAL_DATA_LABEL_FIRST: 'MAKE_GLOBAL_DATA_LABEL_FIRST',
  CHANGE_DATA_TYPE: 'CHANGE_DATA_TYPE',
  PRESS_BACKGROUND: 'PRESS_BACKGROUND',
  MODE_CHANGED: 'MODE_CHANGED',
  ADD_EDGE: 'ADD_EDGE',
  DELETE_NODE: 'DELETE_NODE',
  DELETE_EDGE: 'DELETE_EDGE',
  TOGGLE_ACTION_BAR: 'TOGGLE_ACTION_BAR',
  TOGGLE_DATA_BAR: 'TOGGLE_DATA_BAR',
  TOGGLE_FILTER_BAR: 'TOGGLE_FILTER_BAR',
  CHANGE_THEME: 'CHANGE_THEME',
  LAYOUT_SELECTED: 'LAYOUT_SELECTED',
  LAYOUT_CHANGED: 'LAYOUT_CHANGED',
  IMPORT_DATA: 'IMPORT_DATA',
  EXPORT_DATA: 'EXPORT_DATA',
  TOGGLE_RECORD: 'TOGGLE_RECORD',
  TOGGLE_RECORD_EVENTS: 'TOGGLE_RECORD_EVENTS',
  APPLY_RECORDED_EVENTS: 'APPLY_RECORDED_EVENTS',
  RECORD_FINISHED: 'RECORD_FINISHED',
  TOGGLE_RECORD_ACTIONS: 'TOGGLE_RECORD_ACTIONS',
  LAYOUT_ANIMATION_DURATION_CHANGED: 'LAYOUT_ANIMATION_DURATION_CHANGED',
  SETTINGS_FORM_CHANGED: 'SETTINGS_FORM_CHANGED',
} as const

export const ELEMENT_DATA_FIELDS = {
  POSITION: 'position',
  ID: 'id',
  DATA: 'data',
  CONTEXT: 'context',
} as const

export const EDITOR_MODE = {
  ADD: 'ADD',
  DELETE: 'DELETE',
  CONTINUES_ADD: 'CONTINUES_ADD',
  CONTINUES_DELETE: 'CONTINUES_DELETE',
  DEFAULT: 'DEFAULT',
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

export const PIXI_EVENT_NAMES = {
  onPress: 'click',
  onHoverEnd: 'mouseout',
  onHoverStart: 'mouseover',
  onPressEnd: 'mouseup',
  onPressMove: 'mousemove',
  onPressStart: 'mousedown',
  onRightPress: 'rightclick',
}

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
} as const
export const EDGE_LINE_Z_INDEX = -100
export const EDGE_CONTAINER_Z_INDEX = -99
