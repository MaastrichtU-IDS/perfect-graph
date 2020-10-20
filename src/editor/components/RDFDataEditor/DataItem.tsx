import React from 'react'
import {
  wrapComponent,
  Icon,
  Surface,
  TextInput,
  Select,
  View
} from 'unitx-ui'
import * as R from 'unitx/ramda'
import Form from 'unitx-ui/components/Form'

export type DataItemValue = {
  name: string;
  type: string;
  value: string;
  additionalInfoList: DataItemValue[];
}
export type DataItemProps =  {
  data: DataItemValue;
  onChange?: (newData: DataItemValue) => void;
  uiSchema?: object;
}
const HEIGHT = 200

const DataItem = (props: DataItemProps) => {
  const {
    data,
  } = props
  // console.log('dataItem', data)
  const [state, setState] = React.useState({
    type: data.type
  })
  return (
    <Surface
      style={{
        width: '100%',
        height: HEIGHT,
      }}
    >
      <TextInput
        placeholder="Name"
        style={{
          width: '100%',
        }}
        value={data?.name}
      />
      <Select
        value={data.type}
          onSelect={(value) => {
        setState({
          ...state,
          type: value
        })
      }}>
        {
          R.map(
            ([key, value]: [string, string]) => (
              <Select.Item value={value} title={key}/>
            )
          )(R.toPairs(DATA_TYPES))
        }
      </Select> 
      <Form
        schema={{ type: state.type }}
        formData={data.value}
      >
        <View />
      </Form>
      <Icon
        style={{
          position: 'absolute',
          left: -24,
          top: 0,
        }}
        name="information-outline"
        size={24}
        circle
        onPress={async () => {
          
        }}
      />
    </Surface>
  )
}

export default wrapComponent<DataItemProps>(DataItem, {})


const DATA_TYPES = {
    Boolean: 'boolean',
  Integer: 'integer',
  Float: 'float',
  Double: 'double',
  Date: 'date',
  String: 'string',
  Uri: 'uri',
  // Boolean: 'Boolean',
  // Integer: 'Integer',
  // Float: 'Float',
  // Double: 'Double',
  // Date: 'Date',
  // String: 'String',
  // Uri: 'Uri',
}
// const DATA_TYPES_TO_SCHEMA_TYPE = {
//   Boolean: 'boolean',
//   Integer: 'integer',
//   Float: 'float',
//   Double: 'double',
//   Date: 'date',
//   String: 'string',
//   Uri: 'uri',
// }