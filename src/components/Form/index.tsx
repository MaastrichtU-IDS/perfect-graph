import {Button} from '@mui/material'
import {FormProps as FormPropsDefault} from '@rjsf/core'
import FormDefault from '@rjsf/material-ui'
import {View} from 'colay-ui'
import React from 'react'

export type FormProps<T> = FormPropsDefault<T> & {
  onClear?: (params: {formData: any}) => void
}

export const Form = <T,>(props: FormProps<T>) => {
  const {
    // onClear: onClearCallback,
    formData: formDataValue
  } = props
  const [defaultValue] = React.useState(formDataValue)
  const [, refresh] = React.useState(0)
  const formDataRef = React.useRef(formDataValue)
  const onClear = React.useCallback(() => {
    // @ts-ignore
    formDataRef.current = {...defaultValue}
    refresh(c => c + 1)
    // if (!onClearCallback) {
    //   formDataRef.current = { ...defaultValue }
    //   refresh((c) => c + 1)
    // } else {
    //   onClearCallback({ formData: { ...defaultValue } })
    // }
  }, [defaultValue])
  const keyRef = React.useRef(0)
  React.useMemo(() => {
    formDataRef.current = formDataValue
  }, [formDataValue])
  const formData = formDataRef.current
  React.useMemo(() => {
    keyRef.current += 1
  }, [formData])
  return (
    <FormDefault {...props} key={keyRef.current} formData={formData}>
      {props.children ?? (
        <View
          style={{
            flexDirection: 'row'
          }}
        >
          <Button
            onClick={onClear}
            color="warning"
            fullWidth
            variant="contained"
            style={{
              marginRight: 2
            }}
          >
            Default
          </Button>
          <Button type="submit" fullWidth variant="contained">
            Apply
          </Button>
        </View>
      )}
    </FormDefault>
  )
}
