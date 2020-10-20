// @ts-nocheck
import * as R from 'unitx/ramda'
import { GraphData } from '@type'
import { GraphEditorProps } from '@root/editor'
import useMachine from 'unitx-ui/hooks/useMachine'
import { ActionType } from '@utils/constants'

import { Machine, dataType } from 'unitx/xstate'
import {
  useDataPatch
} from 'unitx-ui'

type AddNodeData = {
  id: string;
  position: PointerEvent;
  data: any;
}
type DeleteNodeData = {
  id: PointerEvent;
}
type AddEdgeData = {
  id: string;
  position: PointerEvent;
  data: any;
  source: string;
  target: string;
}
type DeleteEdgeData = {
  id: PointerEvent;
}
const stateMachine = Machine({
  initial: 'idle',
  context: {},
  states: {
    idle: {

    },
  },
  on: {
    DELETE_NODE: {
      dataType: dataType<DeleteNodeData>(),
      actions: ['deleteNode'],
    },
    ADD_NODE: {
      dataType: dataType<AddNodeData>(),
      actions: ['addNode'],
    },
    DELETE_EDGE: {
      dataType: dataType<DeleteEdgeData>(),
      actions: ['deleteEdge'],
    },
    ADD_EDGE: {
      dataType: dataType<AddEdgeData>(),
      actions: ['addEdge'],
    },
  },
})
export default (data: GraphData, options?: {}) => {
  const [state, updateState, { history }] = useDataPatch(data)
  const {
    sender,
  } = useMachine(stateMachine, {
    actions: {
      addNode: (_, event) => {
        const { data } = event as { data: AddNodeData }
        console.log(data)
      },
      deleteNode: (_, event) => {
        const { data } = event as { data: DeleteNodeData }
        console.log(data)
      },
      addEdge: (_, event) => {
        const { data } = event as { data: AddEdgeData }
        console.log(data)
      },
      deleteEdge: (_, event) => {
        const { data } = event as { data: DeleteEdgeData }
        console.log(data)
      },
      undo: (_, event) => {
        console.log(event)
      },
    },
  })
  return {
    data: state,
    onAction: ({
      type, data, id, ...rest
    }) => {
      const createdID = R.uuid
      return R.cond([
        [R.equals(ActionType.addNode), sender.ADD_NODE({ id: createdID, position: data, data: {} })],
        [R.equals(ActionType.deleteNode), sender.DELETE_NODE({ id })],
        [R.equals(ActionType.addEdge), sender.ADD_EDGE({ id: createdID, ...data })],
        [R.equals(ActionType.deleteEdge), sender.DELETE_EDGE({ id })],
      ])(type)
    },
  } as Pick<GraphEditorProps, 'onAction'>
}
