import React from 'react'
import { SketchPicker } from 'react-color'
import { Typography } from '@mui/material'
import * as C from 'colay/color'


export const ColorPicker = ({ formData, schema, onChange, name }) => {
  
  return (
    <>
      <Typography id={`${schema.title}-color-picker`} gutterBottom>
          {schema.title ?? name}
      </Typography>
      <SketchPicker
       color={C.rgb(formData)} 
       onChange={(color) => {
         return onChange(C.rgbNumber(color.hex))
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