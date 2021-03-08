import {
  MenuItem, Paper, Popper, TextField, Typography,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
} from '@material-ui/core'
import { utils, WidgetProps } from '@rjsf/core'
import { LAYOUT_NAMES } from '@utils/constants'
import { useDisclosure, View } from 'colay-ui'
import React from 'react'
import { LAYOUT_INFO } from './layoutInfo'

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
  const {
    anchorEl,
    isOpen,
    onClose,
    onOpen,
  } = useDisclosure({})
  const hoveredIndexRef = React.useRef(null)
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
            onMouseEnter={(e) => {
              hoveredIndexRef.current = i
              onOpen(e)
            }}
            onMouseLeave={onClose}
          >
            <LayoutNameItem
              openInfo={{
                anchorEl,
                isOpen: hoveredIndexRef.current === i,
              }}
              value={value}
              label={label}
              disabled={disabled}
            />
          </MenuItem>

        // <MenuItem
        //   key={i}
        //   value={value}
        //   disabled={disabled}
        // >

        //   <View
        //   style={{
        //     flexDirection: 'row',
        //     justifyContent: 'space-between',
        //     width: '100%',
        //   }}
        // >
        //   <Typography>
        //     {label}
        //   </Typography>
        //   <img
        //     src={`https://raw.githubusercontent.com/sabaturgay/assets/main/gifs/${value}Layout.gif`}
        //     width={32}
        //     height={32}
        //     alt={label}
        //   />
        // </View>
        // </MenuItem>
        )
      })}
    </TextField>
  )
}

type LayoutNameItemProps = {
  value: string;
  label: string;
  disabled?: boolean;
  openInfo: {
    anchorEl: any;
    isOpen: boolean
  };
}
const LayoutNameItem = (props: LayoutNameItemProps) => {
  const {
    label,
    value,
    openInfo = {},
  } = props
  const {
    isOpen,
    anchorEl,
  } = openInfo
  const info = LAYOUT_INFO[value]
  return (
    <>
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
          src={`https://raw.githubusercontent.com/sabaturgay/assets/main/gifs/${value}Layout.gif`}
          width={32}
          height={32}
          alt={label}
        />
      </View>
      <Popper
        // id={id}
        open={isOpen}
        anchorEl={anchorEl}
        transition
        // disablePortal
        placement="right-start"
      >
        <LayoutCard
          {...info}
        />

      </Popper>
    </>
  )
}

type LayoutCardProps = typeof LAYOUT_INFO['breadthfirst']
const LayoutCard = (props: LayoutCardProps) => {
  const {
    content,
    image,
    title,
  } = props
  return (
    <Card
      style={{
        width: '50vw',
      }}
    >
      <CardActionArea>
        <CardMedia
          component="img"
          alt="Contemplative Reptile"
          height="340"
          width="240"
          
          image={image}
          title={title}
        />
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="h2"
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            component="p"
          >
            {content}
          </Typography>
        </CardContent>
      </CardActionArea>
      {/*
      <CardActions>
        <Button size="small" color="primary">
          Share
        </Button>
        <Button size="small" color="primary">
          Learn More
        </Button>
      </CardActions> */}
    </Card>
  //   <Paper
  //   sx={{
  //     width: { sx: '8vw', md: '50vw' },
  //     display: 'flex',
  //     padding: 10,
  //     flexDirection: 'column',
  //   }}
  // >
  //   <Typography variant="h1">
  //     {info.title}
  //   </Typography>
  //   <img
  //     src={info.image}
  //     width={250}
  //     height={250}
  //     alt={label}
  //   />
  //   <Typography
  //     variant="body1"
  //   >
  //     {info.content}
  //   </Typography>
  // </Paper>
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
