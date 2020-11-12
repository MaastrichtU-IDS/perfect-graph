import { DataItem, RDFType } from '@type'
import { DATA_TYPE_BY_INDEX, TYPE_ICONS } from '@utils/constants'
import React from 'react'
import { ViewStyle } from 'react-native'
import {
  Grid, useData
} from 'unitx-ui'
import { TEXT_STYLE_MAP, TripleInput } from './TripleInput'

type NewTripleItemProps = {
  style?: ViewStyle;
  onAdd: (data: DataItem) => void;
}

const ICON_SIZE = 15

// const TYPE_BY_INDEX = [
//   { type: 'string', title: 'S' },
//   { type: 'number', title: 'N' },
//   { type: 'id', title: 'ID' },
// ]

export const MockNewTripleItemProps: NewTripleItemProps = {
  onAdd: (data) => console.log('newItem', data),
}

export const NewTripleItem = (props: NewTripleItemProps) => {
  const {
    onAdd,
    style,
  } = props
  const [state, update] = useData({
    name: '',
    value: '',
    typeIndex: 0, // TYPE_BY_INDEX[0],
    type: DATA_TYPE_BY_INDEX[0] as RDFType,
  })
  return (
    <Grid style={style}>
      <Grid
        col
        style={{ size: 5.5 }}
      >
        <TripleInput
          placeholder="new property"
          value={state.name}
          onValueChange={(name) => update((draft) => {
            draft.name = name
          })}
          textStyle={TEXT_STYLE_MAP.new}
        />
      </Grid>
      <Grid
        col
        style={{ size: 5.5 }}
      >
        <TripleInput
          placeholder={state.name ? 'Enter Value' : ''}
          value={state.value}
          onValueChange={(value) => update((draft) => {
            draft.value = value
          })}
          textStyle={TEXT_STYLE_MAP.new}
          onEnter={() => {
            if (state.name !== '' && state.value !== '') {
              update((draft) => {
                draft.name = ''
                draft.value = ''
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
          size: ICON_SIZE,
          style: { alignSelf: 'center' },
          onPress: () => {
            update((draft) => {
              const newTypeIndex = (state.typeIndex + 1) % DATA_TYPE_BY_INDEX.length
              draft.typeIndex = newTypeIndex
              draft.type = DATA_TYPE_BY_INDEX[newTypeIndex]
            })
          },
        })
      }
      {/* <Icon
        name="plus-box"
        size={ICON_SIZE}
        style={{ alignSelf: 'center' }}
        onPress={() => {
          update((draft) => {
            draft.name = ''
            draft.value = ''
          })
          onAdd({
            ...state,
            value: [state.value],
            additional: [],
          })
        }}
      /> */}
    </Grid>
  )
}

// { /* <Select
//         selectedIndex={state.selectedIndex}
//         onSelect={(index) => update((draft) => {
//           draft.selectedIndex = index as IndexPath
//           console.log(index)
//           draft.type = TYPE_BY_INDEX[draft.selectedIndex.row].type
//         })}
//         value={TYPE_BY_INDEX[state.selectedIndex.row].title}
//       >
//         {
//           TYPE_BY_INDEX.map((type) => (
//             <SelectItem title={type.title} />
//           ))
//         }
//       </Select> */ }
// class NewNewTripleItem extends Component {
//   constructor(props) {
//     super(props)
//     this.state = { term: props.term, value: props.value, termInfo: props.termInfo }
//   }

//   shouldComponentUpdate(nextProps, nextState, nextContext) {
//     this.state.termInfo = nextProps.termInfo
//     return true
//   }

//   render() {
//     const {
//       props: {
//         expanded,
//       },
//       state: { term, value, termInfo },
//     } = this
//     return (
//       <View
//         style={{
//           width: '100%',
//           height: `${(expanded && (term.length > 15 || value.length > 15)) ? 7 : 2.4436351295999996}vh`,
//           backgroundColor: 'rgba(255,255,255,1)',
//           marginBottom: '2px',
//         }}

//       >
//         <TripleInput
//           expanded={expanded}
//           ref={c => this.termInput = c}
//           termInfo={{ ...termInfo, type: 'term' }}
//           value={term}
//           placeholder="Enter Name"
//           onEnter={() => { this.valueInput.changeMode(true, true) }}
//           onChanged={(text, termInfo) => {
//             this.setState({ termInfo })
//           }}
//           onSuggestionSelected={() => this.valueInput.changeMode(true)}
//         />
//         <TripleInput
//           expanded={expanded}
//           ref={c => this.valueInput = c}
//           termInfo={termInfo}
//           value={value}
//           placeholder="Enter Value"
//           onEnter={() => {
//             const selectedElementID = utils.graphAPI.selectedElement.id
//             utils.graphAPI.setData(selectedElementID, this.termInput.getVal(), this.valueInput.getVal())
//           }}
//         />
//       </View>
//     )
//   }

//   getTripleInfo = () => ({
//     term: this.termInput.getVal(),
//     value: this.valueInput.getVal(),
//   })
// }

// NewNewTripleItem.propTypes = {
// }
// NewNewTripleItem.defaultProps = {
// }

// export default NewNewTripleItem
