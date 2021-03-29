import React from 'react'
import {
  DragDropContext,
  Droppable, Draggable,
  DropResult,
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

export type SortableListProps = {
  onDragEnd: (result: DropResult) => void
  children: React.ReactChildren;
}

export const SortableList = (props: SortableListProps) => {
  const {
    onDragEnd,
    children,
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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            // style={getListStyle(snapshot.isDraggingOver)}
          >
            {
              React.Children.map(children, (child, index) => (
                <Draggable
                  key={child.props.id}
                  draggableId={child.props.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      // style={getItemStyle(
                      //   snapshot.isDragging,
                      //   provided.draggableProps.style,
                      // )}
                    >
                      {child}
                    </div>
                  )}
                </Draggable>
              ))
            }
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
