import React from 'react'
import {
  ButtonBase, Grid, TextField, Typography, TypographyProps,
} from '@material-ui/core'
import {
  useForwardRef,
  wrapComponent,
} from 'colay-ui'

export type Suggestion = {
  title: string;
  value: string;
}
type TextStyle = TypographyProps['style']

export type TripleInputProps = {
  style?: Grid['style'];
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
  } as TextStyle,
} as const

export type TripleInputType = React.FC<TripleInputProps>

const TripleInputElement = (
  props: TripleInputProps,
  ref: React.ForwardedRef<TripleInputType>,
) => {
  const {
    value,
    textStyle,
    onEnter,
  } = props
  const [state, setState] = React.useState({
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
        setState({
          ...state,
          editable,
        })
        setTimeout(() => inputRef.current.focus(), 10)
      },
      getSelectedSuggestion: () => state.selectedSuggestion,
    }),
  )
  const onChangeText = React.useCallback(async (value) => {
    const suggestions = await getSuggestions?.({ value }) ?? []
    setState({
      ...state,
      suggestions,
      isLoading: false,
      selectedSuggestion: null,
    })
    onValueChange?.(value)
  }, [setState, getSuggestions])
  const onBlur = React.useCallback(() => {
    setTimeout(() => {
      setState({
        ...state,
        editable: false,
      })
    }, 200)
  }, [setState])
  return (
    <ButtonBase
      style={{
        width: '100%',
        ...style,
      }}
      onFocus={() => {
        !disabled && inputRef.current.changeMode(true)
      }}
    >
      <TextField
        ref={inputRef}
        value={value}
        onSubmitEditing={onEnter}
        style={{
          width: '100%',
          lineHeight: LINE_HEIGHT,
          height: LINE_HEIGHT,
          ...textStyle,
          ...(state.editable ? {} : { display: 'none' }),
        }}
        onChange={onChangeText}
        onBlur={onBlur}
        placeholder={placeholder}
      />
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
      <Typography
        style={{
          width: '100%',
          lineHeight: LINE_HEIGHT,
          height: LINE_HEIGHT,
          ...textStyle,
          ...(state.editable ? { display: 'none' } : {}),
        }}
      >
        {value === '' ? placeholder : value}
      </Typography>
    </ButtonBase>
  )
}

export const TripleInput = wrapComponent(TripleInputElement, { isForwardRef: true })
