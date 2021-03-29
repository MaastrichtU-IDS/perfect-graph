import React from 'react'
import * as R from 'colay/ramda'
import {
  DragDropContext,
  Droppable, Draggable,
  DropResult,
  DraggableProvided,
  DraggableStateSnapshot,
  DraggableRubric,
  DroppableProvided,
  DroppableStateSnapshot,
} from 'react-beautiful-dnd'

// a little function to help us with reordering the result
export const reorder = (startIndex: number, endIndex: number, list: any[]) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

const grid = 8

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle,
})

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 250,
})

export type SortableListProps<T> = {
  onDragEnd: (result: DropResult) => void
  data: T[]
  renderItem: (props: {
    item: T;
    index: number;
    provided: DraggableProvided;
    snapshot: DraggableStateSnapshot;
    rubric: DraggableRubric;
    droppableProvided: DroppableProvided;
    droppableSnapshot: DroppableStateSnapshot
  }) => React.ReactNode;
  // renderContainer: (props: {})
}

export const SortableList = <T extends any>(props: SortableListProps<T>) => {
  const {
    onDragEnd,
    data = [],
    renderItem,
  } = props
  // const onDragEnd = (result) => {
  //   // dropped outside the list
  //   if (!result.destination) {
  //     return
  //   }

  //   const items = reorder(
  //     state.items,
  //     result.source.index,
  //     result.destination.index,
  //   )

  //   setState({
  //     items,
  //   })
  // }
  const droppableId = React.useMemo(() => R.uuid(), [])
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={droppableId}>
        {(droppableProvided, droppableSnapshot) => (
          <div
            {...droppableProvided.droppableProps}
            ref={droppableProvided.innerRef}
          >
            {
              data.map((item, index) => (
                <Draggable
                  key={item.id}
                  draggableId={item.id}
                  index={index}
                >
                  {(provided, snapshot, rubric) => renderItem({
                    item,
                    index,
                    provided,
                    snapshot,
                    rubric,
                    droppableProvided,
                    droppableSnapshot,
                  })}
                  {/* {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      {child}
                    </div>
                  )} */}
                </Draggable>
              ))
            }
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
