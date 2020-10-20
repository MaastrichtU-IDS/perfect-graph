import React from 'react'
import { Pressable } from 'react-native'
import { Autocomplete, View,Text, useForwardRef, useData,wrapComponent, Grid } from 'unitx-ui'
import { ForwardRef } from 'unitx-ui/type'
import { ViewStyle, TextStyle } from 'react-native'
export type TermInfo =  {
  type: string;
}
export type Suggestion = {
  title: string;
  value: string;
}

export type TripleInputProps = {
  style: ViewStyle;
  placeholder: string;
  expanded?: boolean;
  disabled?: boolean;
  textStyle?: TextStyle;
  value: string;
  termInfo: {
    type: string;
  }
  onChanged?: (text: string, suggestion: Suggestion) => void
  getSuggestions?:  (text: string, options: {}) => Promise<Suggestion[]>
}

export const TripleInput = (props: TripleInputProps, ref: ForwardRef<{}>) => {
  const [state, update] = useData({
    editMode: false,
    text: props.value,
    suggestions: [] as Suggestion[],
    recommendationIndex: 0,
    isLoading: false,
    selectedSuggestion: null as Suggestion | null
  })
  const {
    style, 
    expanded, 
    placeholder, 
    disabled, 
    textStyle, 
    termInfo,
    onChanged,
    getSuggestions,
  } = props
  const inputRef = useForwardRef(
    ref,
    {},
    (ref) => ({
    changeMode: (editMode: boolean) => {
      update((draft) => {
        draft.editMode = editMode
      })
      setTimeout(() => inputRef.current.focus(), 10)
    },
    getVal: () => state.text,
    setVal: (val: string) => update((draft) => {
      draft.text = val
    }),
    getSelectedSuggestion: () => state.selectedSuggestion,
    }),

  )
  const onChangeText = React.useCallback(async (text) => {
    console.log('onChangeText', text)
    const suggestions = await getSuggestions?.(text, termInfo) ?? []
    update((draft) => {
      draft.suggestions = suggestions
      draft.recommendationIndex = 0
      draft.text = text
      draft.isLoading = false
      draft.selectedSuggestion = null
    })
    onChanged?.(text, null)
  }, [update, getSuggestions])

  const onBlur = React.useCallback(() => {
    update((draft) => {
      draft.editMode = false
    })
  }, [update])

  // const onArrowUp = () => {
  //   const {
  //     state: {
  //       text, recommendationIndex, suggestions,
  //     },
  //   } = this
  //   const newSelectedIndex = recommendationIndex > 0 ? recommendationIndex - 1 : recommendationIndex
  //   this.suggestionList.scrollToIndex({ animated: true, index: newSelectedIndex })
  //   this.setState({ recommendationIndex: newSelectedIndex, suggestions: [...suggestions] })
  // }

  // const onArrowDown = () => {
  //   const {
  //     state: {
  //       text, recommendationIndex, suggestions,
  //     },
  //   } = this
  //   const newSelectedIndex = recommendationIndex < suggestions.length - 1 ? recommendationIndex + 1 : recommendationIndex
  //   this.suggestionList.scrollToIndex({ animated: true, index: newSelectedIndex })
  //   this.setState({ recommendationIndex: newSelectedIndex, suggestions: [...suggestions] })
  // }

  // const onTab = () => {
  //   const {
  //     state: {
  //       text, recommendationIndex, suggestions,
  //     },
  //     props: {
  //       onChanged, onSuggestionSelected,
  //     },
  //   } = this
  //   if (text === '') return
  //   this.popup && this.popup.close()
  //   const selectedSuggestion = suggestions[recommendationIndex]
  //   onChanged && onChanged(text, selectedSuggestion || {})
  //   selectedSuggestion && onSuggestionSelected && onSuggestionSelected(selectedSuggestion)
  //   this.setState({
  //     text: (selectedSuggestion && selectedSuggestion.title) || text,
  //     suggestions: [],
  //     recommendationIndex: 0,
  //     selectedSuggestion,
  //   })
  // }

  // const onEnter = () => {
  //   const {
  //     state: {
  //       text,
  //     },
  //     props: {
  //       onEnter,
  //     },
  //   } = this
  //   onEnter && onEnter()
  // }
  
  return (
    <>
      <Pressable
        style={[
          {
            position: 'absolute',
            justifyContent: 'center',
            flex: 1
          },
          style,
        ]}
        onPress={() => {
          !disabled && inputRef.current.changeMode(true)
        }}
      >
          <Autocomplete
            ref={inputRef}
            value={state.text}
            style={{
              fontFamily: 'Roboto',
              fontStyle: 'normal',
              fontWeight: '400',
              fontSize: 14,
              lineHeight: 20,
              letterSpacing: 0,
              color: 'rgba(0, 0,0,1)',
              ...textStyle,
              width: '100%',//state.editMode ? '100%' : 0,
              display: state.editMode ? 'flex' : 'none' 
            }}
            onChangeText={onChangeText}
            onBlur={onBlur}
            // onArrowUp={onArrowUp}
            // onArrowDown={onArrowDown}
            // onTab={onTab}
            // onEnter={onEnter}
            ellipsizeMode="tail"
            numberOfLines={1}
            placeholder={placeholder}
          >
            {state.suggestions.map(
              (item, index) => (
              <Autocomplete.Item
               {...item}
               onPress= {() => {
                const selectedSuggestion = state.suggestions[index]
                onChanged?.(selectedSuggestion.title, selectedSuggestion)
                // onSuggestionSelected?.(selectedSuggestion)
                update((draft) => {
                  draft.editMode = false
                  draft.text= selectedSuggestion.title
                  draft.suggestions= []
                  draft.recommendationIndex= 0
                  draft.selectedSuggestion = selectedSuggestion
                }, ()=> {
                  inputRef.current.blur()
                })
              }}
              // onMouseEnter={() => {
              //   const { state: { recommendationIndex } } = this
              //   if (recommendationIndex !== index) { this.setState({ recommendationIndex: index }) }
              // }}
              />)
            )}
          </Autocomplete>
        <Text
          style={[
            {
              fontFamily: 'Roboto',
              fontStyle: 'normal',
              fontWeight: '400',
              fontSize: 14,
              letterSpacing: 0,
              color: 'rgba(0, 0,0,1)',
              width: '100%',
              display: state.editMode ? 'none' : 'flex' 
            },
            textStyle,
          ]}
          ellipsizeMode="tail"
          numberOfLines={expanded ? 3 : 1}
        >
          {state.text === '' ? placeholder : state.text}
        </Text>
      </Pressable>
    </>
  )
}

  // componentDidMount() {
  //   this.textInputNode = utils.dom.findNode(this.textInput)
  // }

export default wrapComponent(TripleInput, {isForwardRef: true})
