import React from 'react'
import { Graph, GraphEditor, } from "perfect-graph";
import { DefaultTheme } from "perfect-graph/core/theme";
import { getSelectedItemByElement, getSelectedElementInfo } from "perfect-graph/utils";
import { EVENT, EDITOR_MODE } from "perfect-graph/constants";
import { useController } from "perfect-graph/plugins/controller";
import { getPointerPositionOnViewport } from "perfect-graph/utils";
import * as API from "../api/firebase";
import * as R from "colay/ramda";
import { useImmer } from "colay-ui/hooks/useImmer";
import { MouseArrow } from './MouseArrow'

const PROJECT_ID = 'daa9975c-6bdc-4ab3-9a01-2d1dca1f2290'

type User = {
  id: string;
  name: string;
  position: {
    x: number;
    y: number;
  }
}

export function MyGraphEditor(props: any) {
  const {
    width,
    height,
    userName,
  } = props
  const [state, updateState] = useImmer({
    users: [] as User[],
  })
  const userId = React.useMemo(() => R.uuid(), [])
  const [controllerProps, controller] = useController({
    nodes: [],
    edges: [],
    networkStatistics: {
      local: {

      },
    },
    onEvent: ({
      type,
      payload,
      elementId,
      graphRef,
      graphEditor,
      update,
      state,
    }, draft) => {
      const {
        cy,
        context: graphEditorContext
      } = graphEditor
      const element = cy.$id(elementId!)
      const {
        item: selectedItem,
        index: selectedItemIndex,
      } = (element && getSelectedItemByElement(element, draft)) ?? {}
      switch (type) {
        case EVENT.UPDATE_DATA: {
          const {
            value
          } = payload
          const {
            type, selectedItem
          } = getSelectedElementInfo(draft, graphEditor)
          if (type === 'nodes') {
            API.updateNode({
              projectId: PROJECT_ID,
              item: {
                id: selectedItem.id,
                data: value,
              }
            })
          } else {
            API.updateEdge({
              projectId: PROJECT_ID,
              item: {
                id: selectedItem!.id,
                data: value,
              }
            })
          }
          return false
        }
        case EVENT.ADD_NODE: {
          const {
            items,
            edgeItems,
          } = payload
          // draft.nodes = draft.nodes.concat(items)
          // draft.edges = draft.edges.concat(edgeItems ?? [])
          // const { position } = payload
          // draft.nodes.push({
          //   id: `${draft.nodes.length + 1}`, // R.uuid(),
          //   position,
          //   data: [],
          // })
          items.forEach((item) => {
            API.createNode({
              projectId: PROJECT_ID,
              item
            })
          })
          if (draft.mode === EDITOR_MODE.ADD) {
            draft.mode = EDITOR_MODE.DEFAULT
          }
          return false
        }
        case EVENT.DELETE_NODE: {
          const {
            itemIds = [],
          } = payload as {
            itemIds: string[]
          }
          console.log('AA', itemIds)
          // draft.nodes = draft.nodes.filter((nodeItem) => !itemIds.includes(nodeItem.id))
          // draft.edges = draft.edges.filter(
          //   (edgeItem) => !itemIds.includes(edgeItem.source)
          //   && !itemIds.includes(edgeItem.target),
          // )
          itemIds.forEach((id) => {
            API.deleteNode({
              projectId: PROJECT_ID,
              id
            })
          })
          if (draft.mode === EDITOR_MODE.DELETE) {
            draft.mode = EDITOR_MODE.DEFAULT
          }
          return false
        }
        case EVENT.ADD_EDGE: {
          const {
            items,
          } = payload
          items.forEach((item) => {
            API.createEdge({
              projectId: PROJECT_ID,
              item
            })
          })
          if (draft.mode === EDITOR_MODE.ADD) {
            draft.mode = EDITOR_MODE.DEFAULT
          }
          return false
        }
        case EVENT.DELETE_EDGE: {
          const {
            itemIds = [],
          } = payload as {
            itemIds: string[]
          }
          itemIds.forEach((id) => {
            API.deleteEdge({
              projectId: PROJECT_ID,
              id
            })
          })
          if (draft.mode === EDITOR_MODE.DELETE) {
            draft.mode = EDITOR_MODE.DEFAULT
          }
          return false
        }
      //   case EVENT.MODE_CHANGED: {
      //     targetNodeRef.current = null
      //     break
      //   }
        default:
          break;
      }
    }
  });
  const graphEditorRef = controllerProps.ref
  const removeUser = React.useCallback(() => {
    API.deleteUser({
      projectId: PROJECT_ID,
      id: userId
    })
  }, [userId])
  const  createUser = React.useCallback(() => {
    API.updateUser({
      projectId: PROJECT_ID,
      user: {
        id: userId,
        name: userName,
        position: {
          x: 0,
          y: 0
        }
      }
    })
  }, [userId])
  API.useProjectSubscription({
    projectId: PROJECT_ID,
    onEvent: (event) => {
       const {
        type,
        data,
        elementType
       } = event
       controller.update((draft) => {
        const targetList = draft[elementType]
        switch (type) {
          case 'added':
            targetList.push(data)
            break;
          case 'modified':{
            targetList.forEach(
              (item, index) => {
                if (item.id === data.id) {
                  targetList[index] = data
                }
              }
            )
            // .filter((item) => item.id !== data.id)))
            break;
          }
          case 'removed':
            draft[elementType] = targetList.filter(
              (item) => item.id !== data.id
            )
            if (elementType === 'nodes') {
              draft.edges = draft.edges.filter(
            (edgeItem) => data.id !==edgeItem.source
              && data.id !== edgeItem.target,
            )
            }
            break;
        
          default:
            break;
        }
       })
    }
  })
  API.useUserSubscription({
    projectId: PROJECT_ID,
    onEvent: (event) => {
       const {
        type,
        data,
        elementType
       } = event
       if (data.id === userId) {
         return
       }
       updateState((draft) => {
        switch (type) {
          case 'added':
            draft.users.push(data)
            break;
          case 'modified':{
            draft.users.forEach(
              (item, index) => {
                if (item.id === data.id) {
                  draft.users[index] = data
                }
              }
            )
            break;
          }
          case 'removed':
            draft.users = draft.users.filter(
              (item) => item.id !== data.id
            )
            break;
        
          default:
            break;
        }
       })
    }
  })
  React.useEffect(() => {
    createUser()
    const handleWindowChange = (type: string) => (e) => {
      switch (type) {
        case 'visibilitychange':
          if (document.visibilityState === 'visible') {
            createUser()
          } else {
            removeUser()
          }          
          break;
        case 'focus':
          createUser()
          break;
        case 'blur':
          removeUser()
          break;
        case 'blur':
          removeUser()
          break;
        case 'beforeunload':
          removeUser()
          break;
      
        default:
          break;
      }
      console.log('Focus change', e)
    }
    const focusHandler = handleWindowChange('focus')
    const blurHandler = handleWindowChange('blur')
    const visibilityChangeHandler = handleWindowChange('visibilitychange')
    const beforeUnloadHandler = handleWindowChange('beforeunload')
    window.addEventListener('visibilitychange', visibilityChangeHandler, false)
    window.addEventListener('blur', blurHandler, false)
    window.addEventListener('focus', focusHandler, false)
    window.addEventListener('beforeunload', beforeUnloadHandler, false);
    let isTrackRef = {
      current: true
    }
    const interval = setInterval(() => {
      isTrackRef.current = true
    }, 1000)
    const debounced = R.debounce((event) => {
        // if (isTrackRef.current) {
          isTrackRef.current = false
          const position = getPointerPositionOnViewport(
            graphEditorRef.current.viewport,
            event
          )
          API.updateUser({
            projectId: PROJECT_ID,
            user: {
              id: userId,
              name: userName,
              position
            }
          })
        // }
      }, 1000)
    const onMouseMove = (event) => {
      debounced(event)
    }
    document.addEventListener('mousemove', onMouseMove)
    return () => {
      API.deleteUser({
        projectId: PROJECT_ID,
        id: userId
      })
      clearInterval(interval)
      document.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('visibilitychange', visibilityChangeHandler, false)
      window.removeEventListener('blur', blurHandler, false)
      window.removeEventListener('focus', focusHandler, false)
      window.removeEventListener('beforeunload', beforeUnloadHandler, false);
    }
  }, [])
  console.log(state.users)
  return (
    <GraphEditor
      style={{ width, height }}
      {...controllerProps}
    >
      {
        state.users.map((user) => userId !== user.id && (
          // <Graph.View
          //   width={10}
          //   height={10}
          //   fill={DefaultTheme.palette.primary.main}
          //   x={user.position.x}
          //   y={user.position.y}
          // >
          //   <Graph.Text text={R.takeLast(4, user.id)} />
          // </Graph.View>
          <MouseArrow 
            key={user.id}
            user={user}
            color={0xff3300}
            position={user.position}
            label={user.name}
          />
        ))
      }
    </GraphEditor>
  );
}