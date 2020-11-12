import React from 'react'
import { DataItem } from '@type'
import { ViewStyle } from 'react-native'
import {
  Divider, FlatList,
  ScrollView,
} from 'unitx-ui'
import * as R from 'unitx/ramda'
import { EVENT, ELEMENT_DATA_FIELDS } from '@utils/constants'
import { NewTripleItem } from './NewTripleItem'
import {
  TripleItem, EventType,
} from './TripleItem'

// import DataSection from './DataItem'

export type DataEditorProps = {
  style?: ViewStyle;
  data: DataItem[];
  onEvent: (param: {
    type: EventType;
    extraData: any;
    index?: number;
    dataItem?: DataItem;
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
    <ScrollView
      horizontal
      style={{ width: '100%' }}
      contentContainerStyle={{ width: '100%' }}
    >
      <FlatList
        data={data}
        style={{ width: '100%' }}
        contentContainerStyle={{ width: '100%' }}
        renderItem={({ item: dataItem, index }) => (
          <>
            <TripleItem
              {...dataItem}
              onEvent={(type, extraData) => onEvent({
                extraData, index, dataItem, type,
              })}
              isLocalLabel={R.equals(localLabel, [ELEMENT_DATA_FIELDS.DATA, dataItem.name])}
              isGlobalLabel={R.equals(globalLabel, [ELEMENT_DATA_FIELDS.DATA, dataItem.name])}
              isGlobalLabelFirst={isGlobalLabelFirst}
            />
            <Divider />
          </>
        )}
        ListFooterComponent={(
          <NewTripleItem
            onAdd={(dataItem) => onEvent({
              type: EVENT.ADD_DATA,
              extraData: dataItem,
            })}
          />
        )}
      />
    </ScrollView>

  )
}
export const DataEditor = DataEditorElement
// wrapComponent<DataEditorProps>(
//   DataEditorElement,
//   {},
// ) as typeof DataEditorElement
