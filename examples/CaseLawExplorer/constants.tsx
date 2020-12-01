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