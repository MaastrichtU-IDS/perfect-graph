import React from 'react'
import { Pressable, TextStyle, ViewStyle } from 'react-native'
import {
  Grid, Input,

  Text,
  useData,
  useForwardRef, wrapComponent
} from 'unitx-ui'
import { ForwardRef } from 'unitx-ui/type'

export type Suggestion = {
  title: string;
  value: string;
}

export type TripleInputProps = {
  style?: ViewStyle;
  textStyle?: TextStyle;
  placeholder: string;
  editable?: boolean;
  disabled?: boolean;
  value: string;
  onValueChange?: (value: string) => void;
  onEnter?: () => void;
  getSuggestions?: (param: { value: string }) => Promise<Suggestion[]>;
}

export const mockTripleInputProps: TripleInputProps = {
  placeholder: 'Enter Value',
  value: 'Heyy',
  onValueChange: (value) => console.log('val:', value),
  getSuggestions: async () => [
    { title: 'Izmir', value: 'Izmir' },
    { title: 'Istanbul', value: 'Istanbul' },
  ],

}

const LINE_HEIGHT = 27

export const TEXT_STYLE_MAP = {
  value: {
    // fontStyle: 'italic',
  } as TextStyle,
  type: {
    // fontStyle: 'italic',
  } as TextStyle,
  new: {
    fontStyle: 'italic',
  }as TextStyle,
} as const

const TripleInputElement = (props: TripleInputProps, ref: ForwardRef<{}>) => {
  const {
    value,
    textStyle,
    onEnter,
  } = props
  const [state, update] = useData({
    editable: props.editable,
    suggestions: [] as Suggestion[],
    isLoading: false,
    selectedSuggestion: null as Suggestion | null,
  })
  const {
    style,
    placeholder,
    disabled,
    onValueChange,
    getSuggestions,
  } = props
  const inputRef = useForwardRef(
    ref,
    {},
    () => ({
      changeMode: (editable: boolean) => {
        update((draft) => {
          draft.editable = editable
        })
        setTimeout(() => inputRef.current.focus(), 10)
      },
      getSelectedSuggestion: () => state.selectedSuggestion,
    }),
  )
  const onChangeText = React.useCallback(async (value) => {
    const suggestions = await getSuggestions?.({ value }) ?? []
    update((draft) => {
      draft.suggestions = suggestions
      draft.isLoading = false
      draft.selectedSuggestion = null
    })
    onValueChange?.(value,)
  }, [update, getSuggestions])
  const onBlur = React.useCallback(() => {
    setTimeout(() => {
      update((draft) => {
        draft.editable = false
      })
    }, 200)
  }, [update])
  return (
    <Pressable
      style={[
        {
          flex: 1,
        },
        style,
      ]}
      // @ts-ignore
      onFocus={() => {
        !disabled && inputRef.current.changeMode(true)
      }}
    >
      <Grid>
        <Input
          ref={inputRef}
          value={value}
          onSubmitEditing={onEnter}
          style={[
            {
              width: '100%',
              lineHeight: LINE_HEIGHT,
              height: LINE_HEIGHT,
            },
            textStyle,
            state.editable ? null : { display: 'none' },
          ]}
          onChangeText={onChangeText}
          onBlur={onBlur}
          placeholder={placeholder}
        >
          {/* {state.suggestions.map(
            (item, index) => (
              <AutocompleteItem
                {...item}
                onPressIn={() => {
                  const selectedSuggestion = state.suggestions[index]
                  onValueChange?.(selectedSuggestion.value, selectedSuggestion)
                  // onSuggestionSelected?.(selectedSuggestion)
                  update((draft) => {
                    draft.editable = false
                    // draft.value = selectedSuggestion.value
                    draft.suggestions = []
                    draft.selectedSuggestion = selectedSuggestion
                  }, () => {
                    inputRef.current.blur()
                  })
                }}
              />
            ),
          )} */}
        </Input>
        <Text
          style={[
            {
              width: '100%',
              lineHeight: LINE_HEIGHT,
              height: LINE_HEIGHT,
            },
            textStyle,
            state.editable ? { display: 'none' } : {},
          ]}
          // on
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {value === '' ? placeholder : value}
        </Text>
      </Grid>
    </Pressable>
  )
}

export const TripleInput = wrapComponent(TripleInputElement, { isForwardRef: true })
