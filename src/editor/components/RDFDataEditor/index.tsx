import React from 'react'
import { View, ViewProps, FlatList,wrapComponent } from 'unitx-ui'
import * as R from 'unitx/ramda'
import DataSection from './DataSection'

export type RDFDataEditorProps<T> = {
  style?: ViewProps['style'];
  data: Record<string, any>;
}

function RDFDataEditor<T extends { id: string }>(props: RDFDataEditorProps<T>) {
  const {
    data,
    style,
  } = props
  const processedData = R.toJSONItemList(data)
  return (
    <View style={style}>
      <FlatList
        style={{
          width: '100%',
          height: '100%',
        }}
        data={processedData}
        renderItem={({item}) => (
          <DataSection
            data={data[item.key]}
            name={item.key}
            onChange={(newData) => console.log('onChange', newData)}
          />
        )}
      />
    </View>
  )
}

export default wrapComponent(
  RDFDataEditor,
  {},
) as typeof RDFDataEditor
