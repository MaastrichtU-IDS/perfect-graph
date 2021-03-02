import React from 'react'
import {Button, Slider, Typography} from '@material-ui/core'

const SliderUIField = ({ formData, schema, onChange, name}) => {
  return (
    <>
    <Typography id="continuous-slider" gutterBottom>
        {schema.title ?? name}
    </Typography>
    <Slider
      value={formData ?? [schema.minimum, schema.maximum ]}
      onChange={(e) => {
        onChange(e.target.value)
      }}
      valueLabelDisplay="auto"
      aria-labelledby="range-slider"
      min={schema.minimum}
      max={schema.maximum}
    />
    </>
  )
}
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
      'degree': {
        'ui:field': SliderUIField,
      },
      'indegree': {
        'ui:field': SliderUIField,
      },
      'outdegree': {
        'ui:field': SliderUIField,
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

export const getFetchSchema  = (props: {onPopupPress: () => void}) => {
  const {
     onPopupPress
  } = props
  return {
    schema: {
      title: 'Fetch',
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

export const RECORDED_EVENTS = [
  {
      "type": "@",
      "data": {
          "type": "PRESS_BACKGROUND",
          "extraData": {
              "x": 1552.63671875,
              "y": 2627.20703125
          },
          "event": {}
      },
      "date": "2021-02-26T07:59:37.065Z",
      "after": 0
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
      "after": 927
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
      "after": 1648
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
      "after": 2305
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
      "after": 2780
  }
]