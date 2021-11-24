import React from 'react'
import { SketchPicker } from 'react-color'
import { Typography, Divider } from '@mui/material'
import Color from 'color'

export const ColorPicker = ({ value, schema, onChange, name, ...rest }) => {
  return (
    <>
      <Typography id={`${schema.title}-color-picker`} gutterBottom>
          {schema.title ?? name}
      </Typography>
      <Divider />
      <SketchPicker
       color={Color(value).hex()} 
       onChangeComplete={(color) => {
         return onChange(Color(color.hex).rgbNumber())
       }}
      />
    </>
  )
}

// value={formData ?? [schema.minimum, schema.maximum]}
//         onChange={(e) => {
//           onChange(e.target.value)
//         }}
//         valueLabelDisplay="auto"
//         aria-labelledby={`${schema.title}-continuous-slider`}
//         min={schema.minimum}
//         max={schema.maximum}