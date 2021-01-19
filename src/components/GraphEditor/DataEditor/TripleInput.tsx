import React from 'react'
import {
  ButtonBase, Grid,
  TextField, Typography,
  TypographyProps,
  ClickAwayListener,
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
    editable,
  } = props
  const [state, setState] = React.useState({
    editable,
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
    // () => ({}),
  )
  const changeMode = (editable: boolean) => {
    setState({
      ...state,
      editable,
    })
  }
  const onChangeText = React.useCallback(async (value) => {
    const suggestions = await getSuggestions?.({ value }) ?? []
    setState({
      ...state,
      suggestions,
      isLoading: false,
      selectedSuggestion: null,
    })
    onValueChange?.(value)
  }, [getSuggestions])
  const onBlur = React.useCallback(() => {
    setState({
      ...state,
      editable: false,
    })
  }, [])
  return (
    <ClickAwayListener onClickAway={onBlur}>
      <ButtonBase
        sx={{
          width: '100%',
          alignItems: 'flex-start',
          display: 'flex',
          ...style,
        }}
        disableTouchRipple
        onFocus={() => {
          !disabled && changeMode(true)
        }}
      >
        {
          state.editable && (
            <TextField
              ref={inputRef}
              value={value}
              autoFocus
              variant="standard"
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
          )
        }
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
          sx={{
            width: '100%',
            textAlign: 'start',
            // lineHeight: LINE_HEIGHT,
            // height: LINE_HEIGHT,
            ...textStyle,
            ...(state.editable ? { display: 'none' } : {}),
          }}
        >
          {value === '' ? placeholder : value}
        </Typography>
      </ButtonBase>
    </ClickAwayListener>

  )
}

export const TripleInput = wrapComponent(TripleInputElement, { isForwardRef: true })
