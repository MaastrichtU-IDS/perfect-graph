import React from 'react'
import {Button, Slider } from '@material-ui/core'

export const getFilterSchema  = (props: {onPopupPress: () => void}) => {
  const {
     onPopupPress
  } = props
  return {
    schema: {
      title: 'Filter',
      type: 'object',
      required: [
        // 'title',
        // 'year',
        // 'rechtsgebied',
        // 'adjustLayout',
      ],
      additionalProperties: false,
      properties: {
        title: {
          type: 'boolean',
        },
        year: {
          type: 'array',
          items: {
            type: 'number',
          },
          minimum: 1969,
          maximum: 2015,
        },
        live: {
          title: 'boolean',
          type: 'boolean',
        },
        popup: {
          title: 'More Settings',
          type: 'boolean',
        },
      },
    },
    uiSchema: {
      'year': {
        'ui:field': ({ formData, schema, onChange}) => {
          return (
            <Slider
              value={formData ?? [schema.minimum, schema.maximum ]}
              onChange={(e) => {
                onChange(e.target.value)
              }}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              min={schema.minimum}
              max={schema.maximum}
              // getAriaValueText={(text)=> text}
            />
            // <RangeSlider
            //   style={{ width: '90%', height: 40 }}
              // min={schema.minimum}
              // max={schema.maximum}
            //   value={formData}
            //   onValueChange={onChange}
            // />
          )
        },
      },
      'popup': {
        'ui:field': ({ formData, schema, onChange}) => {
          return (
            <Button onClick={onPopupPress}>Open</Button>
          )
        },
      },
    }
  }
}
export const VIEW_CONFIG_SCHEMA = {
  schema: {
    title: 'Visualisation',
    type: 'object',
    required: [],
    additionalProperties: false,
    properties: {
      nodeSize: {
        "type": "string",
        "title": "Node Size",
        "enum": [
          "degree",
          "out_degree",
          "in_degree",
          "year",
        ]
      },
      nodeColor: {
        "type": "string",
        "title": "Node Color",
        "enum": [
          "community",
          "degree",
          "out_degree",
          "in_degree",
          "year",
        ]
      },
    },
  },
}