import React from 'react'
import { Button, Slider, Typography } from '@mui/material'

const SliderUIField = ({ formData, schema, onChange, name }) => {

  return (
    <>
      <Typography id={`${schema.title}-continuous-slider`} gutterBottom>
        {schema.title ?? name}
      </Typography>
      <Slider
        value={formData ?? [schema.minimum, schema.maximum]}
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
export const getFilterSchema = (props: {} = {}) => {
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

export const getQueryBuilderSchema = () => {
  return {
    // children: <div></div>,
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
        DataSources: {
          type: 'array',
          title: 'Data sources',
          uniqueItems: true,
          items: {
            enum: [
              'RS',
              'ECHR',
              'Eurlex'
            ],
            enumNames: [
              'Rechtspraak',
              'European Court of Human Rights',
              'Eurlex'
            ],
            type: 'string'
          },
        },
        Eclis: {
          type: 'string',
          title: 'ECLIs'
        },
        Keywords: {
          type: 'string',
          title: 'Keywords'
        },
        Articles: {
          type: 'string',
          title: 'Articles'
        },
        Date: {
          type: 'array',
          title: 'Date',
          items: {
            type: 'number',
          },
          minimum: 1969,
          maximum: 2015,
        },
        DegreesSources: {
          type: 'integer',
          title: 'Degrees Sources',
          minimum: 1,
          maximum: 5,
        },
        DegreesTargets: {
          type: 'integer',
          title: 'Degrees Targets',
          minimum: 1,
          maximum: 5,
        },
        Instances: {
          type: 'array',
          title: 'Instances',
          uniqueItems: true,
          items: {
            enum: [
              '',
              'Hoge Raad',
              'Raad van State',
              'Centrale Raad van Beroep',
              'College van Beroep voor het bedrijfsleven',
              'Gerechtshof Arnhem-Leeuwarden'
            ],
            type: 'string'
          },
        },
        Domains: {
          type: 'array',
          title: 'Domains',
          uniqueItems: true,
          items: {
            enum: [
              '',
              'Not',
              'Sure',
              'What'
            ],
            type: 'string'
          },
        },
        Doctypes: {
          type: 'array',
          title: 'Document types',
          uniqueItems: true,
          items: {
            enum: [
              '',
              'DEC',
              'OPI'
            ],
            type: 'string'
          },
        },
        LiPermission: {
          type: 'boolean',
          title: 'LI Permission',
        },
      },
    },
    uiSchema: {
      'Date': {
        'ui:field': SliderUIField,
      },
      // 'degreesSources': {
      //   'ui:field': SliderUIField,
      // },
      // 'degreesTargets': {
      //   'ui:field': SliderUIField,
      // },
      // 'source':{
      //   'ui:widget': 'checkboxes'
      // },
      // 'liPermission':{
      //   'ui:widget': 'select'
      // },
    }
  }
}

export const getFetchSchema = (props: { onPopupPress: () => void }) => {
  const {
    onPopupPress
  } = props
  return {
    children: <div></div>,
    schema: {
      title: 'Fetch Data',
      type: 'object',
      additionalProperties: false,
      properties: {
        popup: {
          title: 'Build Query',
          type: 'boolean',
        },
      },
    },
    uiSchema: {
      'Date': {
        'ui:field': SliderUIField,
      },
      // 'degreesSources': {
      //   'ui:field': SliderUIField,
      // },
      // 'degreesTargets': {
      //   'ui:field': SliderUIField,
      // },
      // 'source':{
      //   'ui:widget': 'checkboxes'
      // },
      // 'liPermission':{
      //   'ui:widget': 'select'
      // },
      'popup': {
        'ui:field': ({ formData, schema, onChange }) => {
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

