import { DataItem, RDFType } from '@type'
import { DATA_TYPE_BY_INDEX } from '@utils/constants'
import { TYPE_ICONS } from '@components/GraphEditor/constants'
import React from 'react'
import {
  Grid, GridProps,
} from '@material-ui/core'
import { TEXT_STYLE_MAP, TripleInput } from './TripleInput'

type NewTripleItemProps = {
  style?: GridProps['style'];
  onAdd: (data: DataItem) => void;
}

const ICON_SIZE = 15

// const TYPE_BY_INDEX = [
//   { type: 'string', title: 'S' },
//   { type: 'number', title: 'N' },
//   { type: 'id', title: 'ID' },
// ]

export const MockNewTripleItemProps: NewTripleItemProps = {
  onAdd: (data) => {},
}

export const NewTripleItem = (props: NewTripleItemProps) => {
  const {
    onAdd,
    style,
  } = props
  const [state, setState] = React.useState({
    name: '',
    value: '',
    typeIndex: 0, // TYPE_BY_INDEX[0],
    type: DATA_TYPE_BY_INDEX[0] as RDFType,
  })
  return (
    <Grid
      container
      style={style}
    >
      <Grid
        item
        xs={5}
      >
        <TripleInput
          placeholder="new property"
          value={state.name}
          onValueChange={(name) => setState({
            ...state,
            name,
          })}
          textStyle={TEXT_STYLE_MAP.new}
        />
      </Grid>
      <Grid
        item
        xs={5}
      >
        <TripleInput
          placeholder={state.name ? 'Enter Value' : ''}
          value={state.value}
          onValueChange={(value) => setState({
            ...state,
            value,
          })}
          textStyle={TEXT_STYLE_MAP.new}
          onEnter={() => {
            if (state.name !== '' && state.value !== '') {
              setState({
                ...state,
                name: '',
                value: '',
              })
              onAdd({
                ...state,
                value: [state.value],
                additional: [],
              })
            }
          }}
        />
      </Grid>
      {
        state.name && TYPE_ICONS[state.type]({
          style: { alignSelf: 'center', width: ICON_SIZE },
          onClick: () => {
            const newTypeIndex = (state.typeIndex + 1) % DATA_TYPE_BY_INDEX.length
            setState({
              ...state,
              typeIndex: newTypeIndex,
              type: DATA_TYPE_BY_INDEX[newTypeIndex],
            })
          },
        })
      }
    </Grid>
  )
}
