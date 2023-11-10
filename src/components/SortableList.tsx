import React from 'react'
import * as R from 'colay/ramda'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableProvided,
  DraggableStateSnapshot,
  DraggableRubric,
  DroppableProvided,
  DroppableStateSnapshot
} from 'react-beautiful-dnd'

// const grid = 8

// const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
//   // some basic styles to make the items look a bit nicer
//   userSelect: 'none',
//   padding: grid * 2,
//   margin: `0 0 ${grid}px 0`,

//   // change background colour if dragging
//   background: isDragging ? 'lightgreen' : 'grey',

//   // styles we need to apply on draggables
//   ...draggableStyle,
// })

// const getListStyle = (isDraggingOver: boolean) => ({
//   background: isDraggingOver ? 'lightblue' : 'lightgrey',
//   padding: grid,
//   width: 250,
// })

export type SortableListProps<T> = {
  onReorder?: (result: DropResult) => void
  onDragEnd?: (result: DropResult) => void
  data: T[]
  renderItem: (props: {
    item: T
    index: number
    provided: DraggableProvided
    snapshot: DraggableStateSnapshot
    rubric: DraggableRubric
    droppableProvided: DroppableProvided
    droppableSnapshot: DroppableStateSnapshot
  }) => React.ReactNode
  // renderContainer: (props: {})
}

export const SortableList = <T extends {id: string}>(props: SortableListProps<T>) => {
  const {onReorder, onDragEnd, data = [], renderItem} = props
  const droppableId = React.useMemo(() => R.uuid(), [])
  return (
    <DragDropContext
      onDragEnd={result => {
        onDragEnd?.(result)
        if (!result.destination && result.destination!.index === result.source.index) {
          return
        }
        onReorder?.(result)
      }}
    >
      <Droppable droppableId={droppableId}>
        {(droppableProvided, droppableSnapshot) => (
          <div {...droppableProvided.droppableProps} ref={droppableProvided.innerRef}>
            {data.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {
                  // @ts-ignore
                  (provided, snapshot, rubric) =>
                    renderItem({
                      item,
                      index,
                      provided,
                      snapshot,
                      rubric,
                      droppableProvided,
                      droppableSnapshot
                    })
                }
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
            ))}
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
