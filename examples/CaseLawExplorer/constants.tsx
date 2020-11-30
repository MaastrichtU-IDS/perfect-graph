import React from 'react'
import RangeSlider from 'unitx-ui/components/RangeSlider'

export const FILTER_SCHEMA = {
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
    extendTypeAnnotation: '',
    extendAnnotation: '',
    extendProperties: {},
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
        extendTypeAnnotation: '',
        extendAnnotation: '',
        extendProperties: {},
      },
    },
  },
  uiSchema: {
    'year': {
      'ui:field': ({ formData, schema, onChange}) => {
        return (
          <RangeSlider
            style={{ width: '90%', height: 100 }}
            min={schema.minimum}
            max={schema.maximum}
            value={formData}
            onValueChange={onChange}
          />
        )
      },
    },
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
      nodeColour: {
        "type": "string",
        "title": "Node Colour",
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