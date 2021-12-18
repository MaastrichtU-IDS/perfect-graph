import React from 'react'
import {
  Typography,
  ListItem,
  List,
  ListItemText,
  ListItemIcon,
} from '@mui/material'
import {
  Collapsible,
  CollapsibleContainer,
  CollapsibleTitle,
} from '@components/Collapsible'
import {
  Icon,
} from '@components/Icon'
import {
  useGraphEditor,
} from '@hooks'
import {
  EVENT,
} from '@constants'
import {
  getItemFromElement,
} from '@utils'

export type ConnectedElementsProps = {

}

const ICON_SIZE = 12
const TEXT_VARIANT = 'subtitle2'

export const ConnectedElements = () => {
  const [
    {
      // item,
      selectedElement,
      onEvent,
    },
  ] = useGraphEditor(
    (editor) => {
      const {
        selectedElement,
        selectedItem,
        onEvent,
      } = editor
      return {
        item: editor.selectedItem,
        selectedElement,
        onEvent,
      }
    },
  )
  if (!selectedElement) {
    return null
  }
  const isNode = selectedElement.isNode()
  let itemList
  if (isNode) {
    itemList = selectedElement.connectedEdges().toArray().map(
      getItemFromElement,
    )
  } else {
    itemList = [selectedElement.source(), selectedElement.target()].map(
      getItemFromElement,
    )
  }
  return (
    <Collapsible
      defaultIsOpen
    >
      {
        ({ isOpen, onToggle }) => (
          <>
            <CollapsibleTitle
          onClick={onToggle}
        >
          {`Connected ${isNode ? 'Edges' : 'Nodes'}`}
          </CollapsibleTitle>
            {
              isOpen && (
                <CollapsibleContainer>
          <List
            dense
          >
            {
          itemList.map((item) => (
            <ListItem
              key={item.id}
              button
              onClick={() => onEvent({
                type: EVENT.ELEMENT_SELECTED_WITH_ZOOM,
                payload: {
                  itemIds: [item.id],
                },
                avoidHistoryRecording: true,
              })}
            >
              <ListItemIcon>
                <Icon name="chevron_right" sx={{ fontSize: ICON_SIZE }}/>
              </ListItemIcon>
              <ListItemText 
                primary={
                  <Typography
                    style={{
                      width: '100%',
                      wordWrap: 'break-word',
                    }}
                    variant={TEXT_VARIANT}
                  >
                    {item.id}
                  </Typography>
                }
              />
            </ListItem>
          ))
        }
          </List>
      </CollapsibleContainer>
              )
          }
          </>
        )
      }
      
    </Collapsible>

  )
}
