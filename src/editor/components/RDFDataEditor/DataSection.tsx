import React from 'react'
import {
  wrapComponent,
} from 'unitx-ui'
import DataItem from './DataItem'
import * as R from 'unitx/ramda'

export type DataSectionProps =  {
  data: any;
  name: string;
  onChange: (newData: any) => void;
}

const DataSection = (props: DataSectionProps) => {
  const {
    data,
    name
  } = props
  // console.log('d', name, data)
  return R.map(
    (item: any) => {
      const isObject = R.isPlainObject(item)
      const value = isObject ? (item['@value'] ?? item['@id']) : item
      return (
        <DataItem
          data={{
            name,
            value,
            type: typeof value,
            additionalInfoList: []
          }}
        />
      )
  }
  )(R.ensureArray(data))
}

export default wrapComponent<DataSectionProps>(DataSection, {})
