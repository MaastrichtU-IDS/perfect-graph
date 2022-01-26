import {
  Collapsible,
  CollapsibleContainer,
  CollapsibleTitle,
} from '@components/Collapsible'
import {
  Icon,
} from '@components/Icon'
import {
  EVENT,
} from '@constants'
import {
  useGraphEditor,
} from '@hooks'
import {
  List, Typography,
} from '@mui/material'
import {
  getItemFromElement,
} from '@utils'
import {
  View,
} from 'colay-ui'
import React from 'react'

export type ConnectedElementsProps = {

}

const ICON_SIZE = 12

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
  let itemList: {
    id: string;
    data: any;
  }[]
  let connectedNodeitemList: {
    id: string;
    data: any;
  }[]
  if (isNode) {
    itemList = selectedElement.connectedEdges().toArray().map(
      getItemFromElement,
    )
    connectedNodeitemList = selectedElement.neighborhood().toArray()
      .filter(el => el.isNode()).map(
        getItemFromElement
      )
  } else {
    itemList = [selectedElement.source(), selectedElement.target()].map(
      getItemFromElement,
    )
  }
  return (
    <>
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
                      <ConnectedElementItem 
                        key={item.id}
                          item={item}
                          onClick={() => onEvent({
                            type: EVENT.ELEMENT_SELECTED_WITH_ZOOM,
                            payload: {
                              itemIds: [item.id],
                            },
                            avoidHistoryRecording: true,
                          })}
                        />
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
    {
      isNode && (
        <Collapsible
      defaultIsOpen
    >
      {
        ({ isOpen, onToggle }) => (
          <>
          
            <CollapsibleTitle
          onClick={onToggle}
        >
          {'Connected Nodes'}
          </CollapsibleTitle>
            {
              isOpen && (
                <CollapsibleContainer>
                    <List
                      dense
                    >
                      {
                    connectedNodeitemList.map((item) => (
                      <ConnectedElementItem 
                          key={item.id}
                          item={item}
                          onClick={() => onEvent({
                            type: EVENT.ELEMENT_SELECTED_WITH_ZOOM,
                            payload: {
                              itemIds: [item.id],
                            },
                            avoidHistoryRecording: true,
                          })}
                        />
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
    </>
    

  )
}

const ConnectedElementItem = (props: any) => {
  const {
    onClick,
    item,
  } = props
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
    <Icon name="chevron_right" sx={{ fontSize: ICON_SIZE }}/>
    <Typography
      variant={'subtitle2'}
      component={'a'}
      align="center"
      href={item.id}
      style={{ wordWrap: 'break-word' }}
      // @ts-ignore
      onClick={(e) => {
        onClick?.()
        e.preventDefault()
      }}
    >
      {item.id}
    </Typography>
    </View>

  )
}


{/* <ListItem
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
</ListItem> */}