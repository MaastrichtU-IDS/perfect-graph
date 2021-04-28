import React from 'react'
import {Button, Slider, Typography} from '@material-ui/core'

const SliderUIField = ({ formData, schema, onChange, name}) => {
  return (
    <>
    <Typography id={`${schema.title}-continuous-slider`} gutterBottom>
        {schema.title ?? name}
    </Typography>
    <Slider
      value={formData ?? [schema.minimum, schema.maximum ]}
      onChange={(e) => {
        onChange(e.target.value)
      }}
      valueLabelDisplay="auto"
      aria-labelledby={`${schema.title}-continuous-slider`}
      min={schema.minimum}
      max={schema.maximum}
    />
    </>
  )
}
export const getFilterSchema  = (props: {} = {}) => {
  const {
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
        // label: {
        //   type: 'string',
        // },
        year: {
          type: 'array',
          items: {
            type: 'number',
          },
          minimum: 1969,
          maximum: 2015,
        },
        degree: {
          type: 'array',
          items: {
            type: 'number',
          },
          minimum: 0,
          maximum: 100,
        },
        indegree: {
          type: 'array',
          items: {
            type: 'number',
          },
          minimum: 0,
          maximum: 100,
        },
        outdegree: {
          type: 'array',
          items: {
            type: 'number',
          },
          minimum: 0,
          maximum: 100,
        },
      },
    },
    uiSchema: {
      'year': {
        'ui:field': SliderUIField,
      },
      'degree': {
        'ui:field': SliderUIField,
      },
      'indegree': {
        'ui:field': SliderUIField,
      },
      'outdegree': {
        'ui:field': SliderUIField,
      },
    }
  }
}

export const getFetchSchema  = (props: {onPopupPress: () => void}) => {
  const {
     onPopupPress
  } = props
  return {
    schema: {
      title: 'Fetch Data',
      type: 'object',
      required: [
        // 'title',
        // 'year',
        // 'rechtsgebied',
        // 'adjustLayout',
      ],
      additionalProperties: false,
      properties: {
        label: {
          type: 'string',
        },
        year: {
          type: 'array',
          items: {
            type: 'number',
          },
          minimum: 1969,
          maximum: 2015,
        },
        popup: {
          title: 'More Settings',
          type: 'boolean',
        },
      },
    },
    uiSchema: {
      'year': {
        'ui:field': SliderUIField,
      },
      'popup': {
        'ui:field': ({ formData, schema, onChange}) => {
          return (
            <Button onClick={onPopupPress}>Open Query Builder</Button>
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

export const RECORDED_EVENTS = [
  {
      "type": "@",
      "data": {
          "type": "PRESS_BACKGROUND",
          "payload": {
              "x": 1552.63671875,
              "y": 2627.20703125
          },
          "event": {}
      },
      "date": "2021-02-26T07:59:37.065Z",
  },
  {
      "type": "@",
      "data": {
          "type": "ELEMENT_SELECTED",
          "elementId": "http://deeplink.rechtspraak.nl/uitspraak?id=ECLI:NL:HR:2009:BF8875",
          "event": {
              "data": {
                  "originalEvent": {
                      "metaKey": false
                  }
              }
          }
      },
      "date": "2021-02-26T07:59:37.992Z",
  },
  {
      "type": "@",
      "data": {
          "type": "ELEMENT_SELECTED",
          "elementId": "http://deeplink.rechtspraak.nl/uitspraak?id=ECLI:NL:HR:2009:BJ7832",
          "event": {
              "data": {
                  "originalEvent": {
                      "metaKey": false
                  }
              }
          }
      },
      "date": "2021-02-26T07:59:39.640Z",
  },
  {
      "type": "@",
      "data": {
          "type": "ELEMENT_SELECTED",
          "elementId": "http://deeplink.rechtspraak.nl/uitspraak?id=ECLI:NL:HR:2011:BR5223",
          "event": {
              "data": {
                  "originalEvent": {
                      "metaKey": false
                  }
              }
          }
      },
      "date": "2021-02-26T07:59:41.945Z",
  },
  {
      "type": "@",
      "data": {
          "type": "ELEMENT_SELECTED",
          "elementId": "http://deeplink.rechtspraak.nl/uitspraak?id=ECLI:NL:HR:2012:BV1295",
          "event": {
              "data": {
                  "originalEvent": {
                      "metaKey": false
                  }
              }
          }
      },
      "date": "2021-02-26T07:59:44.725Z",
  }
]