import React from 'react'
import { GraphEditor, } from '../../../../src/components/GraphEditor'
import { Code, } from '../../../index'
import { useController } from '../../../../src/plugins/controller'
import { EVENT, EDITOR_MODE } from '../../../../src/utils/constants'
import { useSubscription } from 'colay-ui'
import * as API from './api'
import * as R from 'colay/ramda'

const COUNT  = 10
const PROJECT_ID = 'daa9975c-6bdc-4ab3-9a01-2d1dca1f2290'
const INITIAL_DATA = {
  nodes: new Array(COUNT).fill(0).map((_, index) => (
    { id: `${index}`, position: { x: index * 100, y: index * 100 },  data: [{ name: 'foaf:name', value: ['ts','saba'], additional: []}]}
  )),
  edges: new Array(COUNT - 1).fill(0).map((_,index) => (
    { id: `edge:${index}`, source: `${index}`,  target: `${index+1}`,  data: [{ name: 'foaf:name', value: ['ts','saba'], additional: []}]}
  )),
}
// "[{ \"name\": \"foaf:name\", \"value\": [\"ts\",\"saba\"], \"additional\": []}]"
export const WithEditElement = () => {
  const targetNodeRef = React.useRef(null)
  const [controllerProps, controller] = useController({
    nodes: [],
    edges: [],
    // graphConfig: {
    //   layout: Graph.Layouts.euler,
    //   zoom: 0.2
    // },
    // settingsBar: {
    //   // opened: true,
    //   forms: [FILTER_SCHEMA, VIEW_CONFIG_SCHEMA]
    // },
    dataBar: {
      // editable: false,
      opened: true,
    },
    actionBar: {
      opened: true,
    },
    onEvent: ({
      type,
      payload,
      element,
      item,
      graphEditor
    }, draft) => {
      switch (type) {
        case EVENT.SETTINGS_FORM_CHANGED:{
          break
        }
        case EVENT.UPDATE_DATA: {
          API.updateNode({
            id: element.id(),
            data: payload.value
          })
          return false
        }
        case EVENT.ELEMENT_SELECTED: {
          if (
            // @ts-ignore
            [EDITOR_MODE.DELETE, EDITOR_MODE.CONTINUES_DELETE].includes(draft.mode)
          ) {
            
            if (element.isNode()) {
              API.deleteNode({
                id: item.id
              })
            } else {
              API.deleteEdge({
                id: item.id
              })
            }
            if (draft.mode === EDITOR_MODE.DELETE) {
              draft.mode = EDITOR_MODE.DEFAULT
            }
            break
          } else if (
            [EDITOR_MODE.ADD, EDITOR_MODE.CONTINUES_ADD].includes(draft.mode)
          ) {
            if (element.isNode()) {
              if (targetNodeRef.current) {
                API.createEdge({
                  data: {},
                  projectID: PROJECT_ID,
                  source: targetNodeRef.current.id(),
                  target: element.id()
                })
                targetNodeRef.current = null
              } else {
                targetNodeRef.current = element
              }
            }
            if (!targetNodeRef.current && draft.mode === EDITOR_MODE.ADD) {
              draft.mode = EDITOR_MODE.DEFAULT
            }
          } else {
            draft.selectedElementIds = [item.id]
          }
          return false
        }
        case EVENT.PRESS_BACKGROUND: {
          if (
            // @ts-ignore
            [EDITOR_MODE.ADD, EDITOR_MODE.CONTINUES_ADD].includes(draft.mode)
            ) {
            const position = payload
            API.createNode({
              position,
              data: [],
              projectID: PROJECT_ID
            })
            if (draft.mode === EDITOR_MODE.ADD) {
              draft.mode = EDITOR_MODE.DEFAULT
            }
          } else {
            graphEditor.cy.$(':selected').unselect()
            draft.selectedElementIds = null
          }
          return false
          break
        }
        case EVENT.MODE_CHANGED: {
          targetNodeRef.current = null
          break
        }
        default:
          break;
      }
      return null
    }
  },)
  useSubscription(() => {
    return API.onUpdateNode((node) => {
      controller.update((draft)=> {
        draft.nodes = R.update(
          draft.nodes.findIndex((val) => val.id === node.id),
           node,
           draft.nodes
           )
           return draft
      })
    })
  })
  useSubscription(() => {
    return API.onCreateNode((node) => {
      controller.update((draft)=> {
        draft.nodes.push(node)
        return draft
      })
    })
  })
  useSubscription(() => {
    return API.onDeleteNode((id) => {
      controller.update((draft)=> {
        draft.nodes = draft.nodes.filter((node) => node.id !== id)
        draft.edges = draft.edges.filter(
          (edgeItem) => edgeItem.source !== id && edgeItem.target !== id,
        )
        return draft
      })
    })
  })
  useSubscription(() => {
    return API.onUpdateEdge((edge) => {
      controller.update((draft)=> {
        draft.edges = R.update(
          draft.edges.findIndex((val) => val.id === edge.id),
           edge,
           draft.edges
           )
           return draft
      })
    })
  })
  useSubscription(() => {
    return API.onCreateEdge((edge) => {
      controller.update((draft)=> {
        draft.edges.push(edge)
        return draft
      })
    })
  })
  useSubscription(() => {
    return API.onDeleteEdge((id) => {
      controller.update((draft)=> {
        draft.edges = draft.edges.filter((edge) => edge.id !== id)
        return draft
      })
    })
  })
  React.useEffect(() => {
    const init = async () => {
      const project  = (await API.listProjects())[0]
      controller.update((draft)=> {
        draft.nodes = project.nodes
        draft.edges = project.edges
        return draft
      })
    }
    init()
  }, [])
  return (
    <GraphEditor
       style={{ width: '100%', height: 700 }}
       configExtractor={({ item }) => ({ data: { data: item }})}
       {...controllerProps}
     />
  )
}
export const WithEdit = () => {
  return (
    <Code>
      {`() => {
  const [data, setData] = React.useState({
    nodes: [
         { id: '1', position: { x: 10, y: 10 } },
         { id: '2', position: { x: 300, y: 100 } },
       ],
    edges: [
         { id: '51', source: '1', target: '2' }
       ]
  })
  return (
    <GraphEditor
       style={{ width: '100%', height: 250 }}
       configExtractor={({ item }) => ({ data: { data: item }})}
       nodes={data.nodes}
       edges={data.edges}
     />
  )
}
    `}
    </Code>
  )
}

