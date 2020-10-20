import React, { Component } from 'react'
import { View, Icon } from 'unitx-ui'
import TripleInput from './TripleInput'

class TripleItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      edited: false,
      termInfo: props.termInfo,
    }
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    this.state.termInfo = nextProps.termInfo
    return true
  }

  render() {
    const {
      props: {
        term, value, elementType, expanded, id: edgeID, nodeLabel, edgeLabel, nodeSpecLabel, edgeSpecLabel,
      },
      state: {
        edited, editedTerm, editedValue, termInfo,
      },
    } = this
    const isNodeElement = elementType === 'node'
    const disabledName = term === 'id' || term === 'label'
    const disabledValue = term === 'id'
    const deletable = !utils._.includes(['id', 'label', 'source', 'target'], term)
    const isLabel = isNodeElement ? (nodeLabel === term) : (edgeLabel === term)
    const isSpecLabel = isNodeElement ? (nodeSpecLabel === term) : (edgeSpecLabel === term)
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
          value={term}
          ref={c => this.nameTripleInput = c}
          placeholder={(termInfo.type === 'uri') ? 'Enter Relation' : 'Enter Term'}
          termInfo={{ ...termInfo, type: 'term' }}
          autocomplete
          onEnter={this.nameInputEnter}
          onChanged={(text, termInfo) => {
            const tripleInfo = this.getTripleInfo()
            this.setState({ edited: term !== text || value !== tripleInfo.value, editedTerm: text, termInfo })
          }}
          onSuggestionSelected={() => this.valueTripleInput.changeMode(true)}
          disabled={disabledName}
          textStyle={(isNodeElement && termInfo.type === 'uri') ? { fontStyle: 'italic' } : {}}
        />
        <TripleInput
          expanded={expanded}
          ref={c => this.valueTripleInput = c}
          placeholder="Enter Value"
          termInfo={termInfo}
          value={value}
          onEnter={this.valueInputEnter}
          onChanged={(text, termInfo) => {
            const tripleInfo = this.getTripleInfo()
            this.setState({ edited: term !== tripleInfo.term || value !== text, editedValue: text })
          }}
          disabled={disabledValue}
          textStyle={(isNodeElement && termInfo.type === 'uri') ? { fontStyle: 'italic' } : {}}
        />
        {
          edited ? (
            <React.Fragment>
              <Icon
                name="md-save"
                iconSet="Ionicons"
                style={{
                  position: 'absolute',
                  left: '87.71%',
                  right: '6.14%',
                  top: '5%',
                  bottom: '5%',
                  color: 'rgba(0, 217, 29, 1)',
                }}
                size={18}
                onPress={this.saveChanges}
                responsive={false}
              />
              <Icon
                name="md-undo"
                pack="Ionicons"
                style={{
                  position: 'absolute',
                  left: '93.85%',
                  right: '0.01%',
                  top: '5%',
                  bottom: '5%',
                }}
                color='rgba(245, 13, 5, 1)'
                size={18}
                onPress={this.undoChanges}
                responsive={false}
              />
            </React.Fragment>
          )
            : (
              <React.Fragment>
                <Icon
                  name={isSpecLabel ? 'label-variant' : 'label-variant-outline'}
                  iconSet="MaterialCommunityIcons"
                  style={{
                    position: 'absolute',
                    left: '81.23%',
                    right: '12.63%',
                    top: '5%',
                    bottom: '5%',
                  }}
                  size={18}
                  onPress={this.changeSpecLabel}
                  responsive={false}
                />
                <Icon
                  name={isLabel ? 'label' : 'label-outline'}
                  pack="MaterialIcons"
                  style={{
                    position: 'absolute',
                    left: '87.71%',
                    right: '6.14%',
                    top: '5%',
                    bottom: '5%',
                  }}
                  size={18}
                  onPress={this.changeLabel}
                />
                {
                (deletable) && (
                  <Icon
                    name="ios-close-circle-outline"
                    iconSet="Ionicons"
                    style={{
                      position: 'absolute',
                      left: '93.85%',
                      right: '0.01%',
                      top: '5%',
                      bottom: '5%',
                    }}
                    size={18}
                    onPress={() => {
                      const id = utils.graphAPI.selectedElement.element.id()
                      if (termInfo.type === 'literal') {
                        utils.graphAPI.removeData(id, term)
                      } else {
                        utils.graphAPI.removeElement(id)
                      }
                    }}
                    responsive={false}
                  />
                )
              }
              </React.Fragment>
            )
        }
      </View>
    )
  }

  getTripleInfo = () => ({
    term: this.nameTripleInput.getVal(),
    value: this.valueTripleInput.getVal(),
  })

  saveChanges = () => {
  }

  undoChanges = () => {
    const { props: { term, value } } = this
    this.nameTripleInput.setVal(term)
    this.valueTripleInput.setVal(value)
    this.setState({ edited: false })
  }

  changeSpecLabel = () => {
    const { props: { termInfo: { type }, term, id: edgeID } } = this
    const { nodesSpecLabels, selectedElement: { id: selectedElementID } } = utils.graphAPI
    if (type === 'literal') {
      if (nodesSpecLabels[selectedElementID] !== term) {
        utils.graphAPI.changeLabel(term, 'nodeLabel', true)
      } else {
        utils.graphAPI.changeLabel(null, 'nodeLabel', true)
      }
    } else if (utils.graphAPI.edgesSpecLabels[edgeID] !== term) { // edge label
      utils.graphAPI.changeLabel(term, 'edgeLabel', true)
    } else {
      utils.graphAPI.changeLabel(null, 'edgeLabel', true)
    }
  }

  changeLabel = () => {
    const { props: { term, termInfo: { type } } } = this
    if (type === 'literal') {
      utils.graphAPI.changeLabel(term, 'nodeLabel')
    } else {
      utils.graphAPI.changeLabel(term, 'edgeLabel')
    }
  }

  nameInputEnter = () => {
    this.valueTripleInput.changeMode(true)
    // this.valueTripleInput.changeMode(true)
    // const newName = this.nameTripleInput.getVal()
    // const id = utils.graphAPI.selectedElement.element.id()
    // if (term === newName) return
    // const oldName = term
    // if (type === 'literal') { // nodeData
    //   utils.graphAPI.removeData(id, oldName)
    //   utils.graphAPI.setData(id, newName, value)
    // } else if (utils.graphAPI.selectedElement.element.isNode()) { // edgeData
    //   utils.graphAPI.setData(id, 'label', newName)
    // } else { // edgeData on Edge
    //   utils.graphAPI.removeData(id, oldName, newName)
    //   utils.graphAPI.setData(id, newName, value)
    // }
  }

  valueInputEnter = () => {

    // const selectedElement = utils.graphAPI.selectedElement.element
    // const id = selectedElement.id()
    // const newValue = this.valueTripleInput.getVal()
    // if (type === 'literal') { // nodeData
    //   utils.graphAPI.setData(id, term, newValue)
    // } else if (utils.graphAPI.se.isNode()) { // edgeData
    //   utils.graphAPI.setData(id, 'label', newValue)
    // } else {
    //   utils.graphAPI.setData(id, term, newValue)
    // }
  }
}

TripleItem.propTypes = {
}
TripleItem.defaultProps = {
}

export default TripleItem
