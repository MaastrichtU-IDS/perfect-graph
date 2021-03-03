import React from 'react'
import { DataItem } from '@type'
import {
  Container, List, ListItem, Divider, BoxProps,
} from '@material-ui/core'
import * as R from 'colay/ramda'
import { EVENT, ELEMENT_DATA_FIELDS } from '@utils/constants'
import { NewTripleItem } from './NewTripleItem'
import {
  TripleItem, EventType,
} from './TripleItem'
import { DataForm } from './DataForm'

export type DataEditorProps = {
  style?: BoxProps['style'];
  data: DataItem[];
  onEvent: (param: {
    type: EventType;
    payload: any;
    index?: number;
    item?: DataItem;
  }) => void;
  localLabel?: string[]| null;
  globalLabel?: string[] | null;
  isGlobalLabelFirst?: boolean;
}

const DataEditorElement = (props: DataEditorProps) => {
  const {
    data,
    onEvent,
    localLabel,
    globalLabel,
    isGlobalLabelFirst,
  } = props
  return (
    <Container
      style={{ width: '100%' }}
    >
      <List style={{ width: '100%' }}>
        {
      data.map((item, index) => (
        <ListItem key={`${index}`}>
          <TripleItem
            {...item}
            onEvent={({type, payload}) => onEvent({
              payload, index, item, type,
            })}
            isLocalLabel={R.equals(localLabel, [ELEMENT_DATA_FIELDS.DATA, item.name])}
            isGlobalLabel={R.equals(globalLabel, [ELEMENT_DATA_FIELDS.DATA, item.name])}
            isGlobalLabelFirst={isGlobalLabelFirst}
          />
          <Divider />
        </ListItem>
      ))
          }
        <ListItem key={`${data.length}`}>
          <NewTripleItem
            onAdd={(item) => onEvent({
              type: EVENT.ADD_DATA,
              payload: item,
            })}
          />
        </ListItem>
      </List>
    </Container>

  )
}
export const DataEditor = DataForm // DataEditorElement
// wrapComponent<DataEditorProps>(
//   DataEditorElement,
//   {},
// ) as typeof DataEditorElement
