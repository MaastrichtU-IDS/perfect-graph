import React, { Component } from 'react'
import utils from '@utils'
import { View } from '@components/index'
import TripleInput from '../TripleInput'

class NewTripleItem extends Component {
  constructor(props) {
    super(props)
    this.state = { term: props.term, value: props.value, termInfo: props.termInfo }
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    this.state.termInfo = nextProps.termInfo
    return true
  }

  render() {
    const {
      props: {
        expanded,
      },
      state: { term, value, termInfo },
    } = this
    return (
      <View
        style={{
          width: '100%',
          height: `${(expanded && (term.length > 15 || value.length > 15)) ? 7 : 2.4436351295999996}vh`,
          backgroundColor: 'rgba(255,255,255,1)',
          marginBottom: '2px',
        }}

      >
        <TripleInput
          expanded={expanded}
          ref={c => this.termInput = c}
          termInfo={{ ...termInfo, type: 'term' }}
          value={term}
          placeholder="Enter Name"
          onEnter={() => { this.valueInput.changeMode(true, true) }}
          onChanged={(text, termInfo) => {
            this.setState({ termInfo })
          }}
          onSuggestionSelected={() => this.valueInput.changeMode(true)}
        />
        <TripleInput
          expanded={expanded}
          ref={c => this.valueInput = c}
          termInfo={termInfo}
          value={value}
          placeholder="Enter Value"
          onEnter={() => {
            const selectedElementID = utils.graphAPI.selectedElement.id
            utils.graphAPI.setData(selectedElementID, this.termInput.getVal(), this.valueInput.getVal())
          }}
        />
      </View>
    )
  }

  getTripleInfo = () => ({
    term: this.termInput.getVal(),
    value: this.valueInput.getVal(),
  })
}

NewTripleItem.propTypes = {
}
NewTripleItem.defaultProps = {
}

export default NewTripleItem
