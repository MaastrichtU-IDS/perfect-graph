import React, { Component } from 'react'
import {
  ViewPropTypes, Dimensions, Animated, PanResponder,
} from 'react-native'
import TripleItem from './TripleItem'
import NewTripleItem from './NewTripleItem'

const SIDEBAR_WIDTH_PERCENTAGE = 20
const MAX_RECOMMENDATION_COUNT = 5

class EnterInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pinIt: props.pinIt,
      editor: {},
      nodeLabel: 'label',
      edgeLabel: 'label',
    }
    this.styles = getStyles(this)
    this.viewOpen = false
    this.dimensions = Dimensions.get('window')
    this.createPanResponder()
  }

  componentDidMount() {
    // const { state: { pinIt } } = this
    // if (pinIt) {
    //   setTimeout(() => {
    //     this.open(true)
    //   }, 100)
    // }
  }


  render() {
    const {
      state: {
        data, pinIt, expanded, editor: editorInfo, disabled, element,
        nodeLabel, edgeLabel, nodeSpecLabel, edgeSpecLabel,

      },
      styles,
    } = this
    const editor = editorInfo || {}
    const elementType = element && element.isNode() ? 'node' : 'edge'
    return (
      <EnterInfoView
        PinIt={{
          value: pinIt,
          onValueChange: val => this.setState({ pinIt: val }, this.close),
          style: {
            visibility: 'hidden',
          },
        }}
        EditorInfo={{
          EditorInfo: {
            style: { ...(editor.displayName ? {} : { height: 0 }) },
          },
          DisplayName: {
            value: editor.displayName || '\'',
          },
          ProfileImage: {
            source: { uri: editor.photoURL || '\'' },
          },
          Editing: {
            value: `${editor.displayName ? '' : '\''}`,
          },
        }}
        EnterInformation={{
          ref: c => this.EnterInformation = c,
          animations: [
            {
              key: 'open',
              to: {
                left: `${100 - SIDEBAR_WIDTH_PERCENTAGE}%`,
                // right: '0%',
                // opacity: 1,
              },
              duration: 500,
            },
            {
              key: 'close',
              to: {
                left: '100%',
                // right: `-${SIDEBAR_WIDTH_PERCENTAGE}%`,
                // opacity: 1,
              },
              duration: 500,
            },
          ],
        }}
        Triples={{
          Triples: {
            ref: c => this.triplesFlatList = c,
            data,
            expanded,
            nodeLabel,
            edgeLabel,
            nodeSpecLabel,
            edgeSpecLabel,
            removeClippedSubviews: true,
            windowSize: 50,
            initialNumToRender: 15,
            renderItem: ({
              item, index,
            }) => (
              <TripleItem
                ref={(c) => {
                  if (item.term === 'label') {
                    this.labelTripleItem = c
                  }
                }}
                expanded={expanded}
                {...item}// term, value, type, id, source, target
                elementType={elementType}
                nodeLabel={nodeLabel}
                edgeLabel={edgeLabel}
                nodeSpecLabel={nodeSpecLabel}
                edgeSpecLabel={edgeSpecLabel}
              />
            ),
            ListFooterComponent: () => (
              element ? (
                <NewTripleItem
                  expanded={expanded}
                  term=""
                  value=""
                  termInfo={{}}
                />
              ) : null
            ),
          },
        }}
        DisableSurface={{
          style: { ...(disabled ? {} : { height: 0 }) },
        }}
        Seperator={{
          ...this.panResponder.panHandlers,
          ref: c => this.seperator = c,
          style: {
            width: 1.7,
          },
          animations: {
            key: 'grab',
            to: {
              backgroundColor: 'rgba(0,0,0,0.5)',
            },
            duration: 300,
          },
        }}
        SeperatorButton={{
          style: {
            width: 1.7,
            cursor: 'col-resize',
          },
        }}
      />

    )
  }

  open = (force) => {
    const { state: { pinIt } } = this
    if (!force && pinIt) return
    this.setState(this.initialState)
    if (this.viewOpen) return
    this.viewOpen = true

    this.EnterInformation.animations.open.play()
  }

  close = () => {
    const { state: { pinIt } } = this
    if (pinIt) return
    if (!this.viewOpen) return
    this.viewOpen = false
    this.EnterInformation.animations.open.reverse()
  }

  createPanResponder = () => {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gesture) => true,
      onPanResponderGrant: (e, gesture) => {
        this.seperator.animations.grab.play()
      },
      onPanResponderMove: (e, gesture) => {
        const { moveX } = gesture
        const newLeft = (moveX / utils.dom.dimensions.window.width) * 100
        const newWidth = 100 - newLeft
        // if (newWidth < 16) {
        //   this.setState({ pinIt: false }, this.close)
        //   // this.viewOpen = false
        // }

        if (newWidth <= 20 && this.state.expanded) {
          this.setState({ expanded: false })
        }
        if (newWidth > 23 && !this.state.expanded) {
          this.setState({ expanded: true })
        }

        if (newWidth < SIDEBAR_WIDTH_PERCENTAGE) return
        if (newWidth > 50) return
        this.EnterInformation.updateStyle({ left: `${newLeft}%`, width: `${newWidth}%` })
      },
      onPanResponderRelease: (e, gesture) => {
        this.seperator.animations.grab.reverse()
      },

      onMoveShouldSetPanResponder: (evt, gestureState) => true,
    })
  }

  focusLabel= () => {
    this.labelTripleItem.valueTripleInput.changeMode(true)
  }

  changeState = (state, callback) => {
    this.setState(state, () => { callback && callback() })
  }
}

EnterInfo.propTypes = {
}
EnterInfo.defaultProps = {
  editor: {},
}

export default EnterInfo

// eslint-disable-next-line no-unused-vars
const getStyles = ({ props, state }) => ({
  container: `
    
  `,
})
