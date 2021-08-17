import React from 'react'
import {
  Typography,
  AccordionDetails,
  Accordion,
  AccordionSummary,
  ListItem,
  List,
  ListItemText,
  ListItemIcon,
} from '@material-ui/core'
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
    <Accordion
      defaultExpanded
    >
      <AccordionSummary>
        <Typography
          variant="h6"
        >
          {`Connected ${isNode ? 'Edges' : 'Nodes'}`}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
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
            })}
          >
            <ListItemIcon>
              <Icon name="chevron_right" />
            </ListItemIcon>
            <ListItemText primary={item.id} />
          </ListItem>
        ))
      }
        </List>
      </AccordionDetails>
    </Accordion>

  )
}
