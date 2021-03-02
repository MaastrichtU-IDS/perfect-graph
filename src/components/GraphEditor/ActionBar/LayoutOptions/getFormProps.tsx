import React from 'react'
import { MenuItem, TextField, Typography } from '@material-ui/core'
import { WidgetProps, utils } from '@rjsf/core'
import { LAYOUT_NAMES } from '@utils/constants'
import { View } from 'colay-ui'

const { asNumber, guessType } = utils

const nums = new Set(['number', 'integer'])

/**
 * This is a silly limitation in the DOM where option change event values are
 * always retrieved as strings.
 */
const processValue = (schema: any, value: any) => {
  // "enum" is a reserved word, so only "type" and "items" can be destructured
  const { type, items } = schema
  if (value === '') {
    return undefined
  } if (type === 'array' && items && nums.has(items.type)) {
    return value.map(asNumber)
  } if (type === 'boolean') {
    return value === 'true'
  } if (type === 'number') {
    return asNumber(value)
  }

  // If type is undefined, but an enum is present, try and infer the type from
  // the enum values
  if (schema.enum) {
    if (schema.enum.every((x: any) => guessType(x) === 'number')) {
      return asNumber(value)
    } if (schema.enum.every((x: any) => guessType(x) === 'boolean')) {
      return value === 'true'
    }
  }

  return value
}

const LayoutNameSelect = (props: WidgetProps) => {
  const {
    schema,
    id,
    label,
    required,
    disabled,
    readonly,
    options,
    value,
    multiple,
    autofocus,
    onChange,
    onBlur,
    onFocus,
    rawErrors = [],
  } = props
  const { enumOptions, enumDisabled } = options

  const emptyValue = multiple ? [] : ''

  const _onChange = ({
    target: { value },
  }: React.ChangeEvent<{ name?: string; value: unknown }>) => onChange(processValue(schema, value))
  const _onBlur = ({ target: { value } }: React.FocusEvent<HTMLInputElement>) => onBlur(id, processValue(schema, value))
  const _onFocus = ({
    target: { value },
  }: React.FocusEvent<HTMLInputElement>) => onFocus(id, processValue(schema, value))

  return (
    <TextField
      id={id}
      label={label || schema.title}
      select
      value={typeof value === 'undefined' ? emptyValue : value}
      required={required}
      disabled={disabled || readonly}
      autoFocus={autofocus}
      error={rawErrors.length > 0}
      onChange={_onChange}
      onBlur={_onBlur}
      onFocus={_onFocus}
      InputLabelProps={{
        shrink: true,
      }}
      SelectProps={{
        multiple: typeof multiple === 'undefined' ? false : multiple,
      }}
    >
      {(enumOptions as any).map(({ value, label }: any, i: number) => {
        const disabled: any = enumDisabled && (enumDisabled as any).indexOf(value) != -1
        return (
          <MenuItem
            key={i}
            value={value}
            disabled={disabled}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <Typography>
                {label}
              </Typography>
              <img
                src="https://images.pexels.com/photos/6202038/pexels-photo-6202038.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                width={32}
                height={32}
                alt={label}
              />
            </View>
          </MenuItem>
        )
      })}
    </TextField>
  )
}

export const getFormProps = () => ({
  schema: {
    title: 'Layout',
    properties: {
      name: {
        type: 'string',
        enum: LAYOUT_NAMES,
      },
      animationDuration: {
        type: 'number',
        minimum: 0,
        maximum: 10000,
      },
      refresh: {
        type: 'number',
        minimum: 0,
        maximum: 100,
      },
      maxIterations: {
        type: 'number',
        minimum: 0,
        maximum: 1000,
      },
      maxSimulationTime: {
        type: 'number',
        minimum: 0,
        maximum: 1000,
      },
    },
  },
  uiSchema: {
    name: {
      'ui:field': (props) => {
        const {
          schema,
          formData,
        } = props
        return (
          <LayoutNameSelect
            {...props}
            value={formData}
            options={{
              enumOptions: schema.enum.map(
                (value) => ({
                  label: value,
                  value,
                }),
              ),
            }}
          />
        )
      },
    },
  },
})
