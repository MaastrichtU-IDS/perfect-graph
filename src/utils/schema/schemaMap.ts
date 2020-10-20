const schemaMap = {
  DataItem: {
    title: 'DataItem',
    anyOf: [
      {
        title: 'DateDataItem',
        $ref: '#/definitions/DateDataItem',
      },
      {
        title: 'StringDataItem',
        $ref: '#/definitions/StringDataItem',
      },
      {
        title: 'BooleanDataItem',
        $ref: '#/definitions/BooleanDataItem',
      },
      {
        title: 'FileDataItem',
        $ref: '#/definitions/FileDataItem',
      },
      {
        title: 'UriDataItem',
        $ref: '#/definitions/UriDataItem',
      },
      {
        title: 'DateTimeDataItem',
        $ref: '#/definitions/DateTimeDataItem',
      },
      {
        title: 'EmailDataItem',
        $ref: '#/definitions/EmailDataItem',
      },
    ],
    extendTypeAnnotation: '',
    extendAnnotation: '',
    extendProperties: {},
    properties: {},
  },
  DateDataItem: {
    title: 'DateDataItem',
    type: 'object',
    required: [
      'type',
      'key',
      'value',
    ],
    additionalProperties: false,
    extendTypeAnnotation: '',
    extendAnnotation: '',
    extendProperties: {},
    properties: {
      type: {
        title: '\'date\'',
        type: 'string',
        enum: [
          'date',
        ],
        extendTypeAnnotation: '',
        extendAnnotation: '',
        extendProperties: {},
      },
      key: {
        title: 'string',
        type: 'string',
        extendTypeAnnotation: '',
        extendAnnotation: '',
        extendProperties: {},
      },
      value: {
        title: 'Date',
        $ref: '#/definitions/Date',
        extendTypeAnnotation: '',
        extendAnnotation: '',
        extendProperties: {},
      },
    },
  },
  Date: {
    title: 'Date',
    type: 'string',
    extendTypeAnnotation: '',
    extendAnnotation: '{format: \'date\'}',
    format: 'date',
    extendProperties: {
      format: 'date',
    },
    properties: {},
  },
  StringDataItem: {
    title: 'StringDataItem',
    type: 'object',
    required: [
      'type',
      'key',
      'value',
    ],
    additionalProperties: false,
    extendTypeAnnotation: '',
    extendAnnotation: '',
    extendProperties: {},
    properties: {
      type: {
        title: '\'string\'',
        type: 'string',
        enum: [
          'string',
        ],
        extendTypeAnnotation: '',
        extendAnnotation: '',
        extendProperties: {},
      },
      key: {
        title: 'string',
        type: 'string',
        extendTypeAnnotation: '',
        extendAnnotation: '',
        extendProperties: {},
      },
      value: {
        title: 'string',
        type: 'string',
        extendTypeAnnotation: '',
        extendAnnotation: '',
        extendProperties: {},
      },
    },
  },
  BooleanDataItem: {
    title: 'BooleanDataItem',
    type: 'object',
    required: [
      'type',
      'key',
      'value',
    ],
    additionalProperties: false,
    extendTypeAnnotation: '',
    extendAnnotation: '',
    extendProperties: {},
    properties: {
      type: {
        title: '\'boolean\'',
        type: 'string',
        enum: [
          'boolean',
        ],
        extendTypeAnnotation: '',
        extendAnnotation: '',
        extendProperties: {},
      },
      key: {
        title: 'string',
        type: 'string',
        extendTypeAnnotation: '',
        extendAnnotation: '',
        extendProperties: {},
      },
      value: {
        title: 'boolean',
        type: 'boolean',
        extendTypeAnnotation: '',
        extendAnnotation: '',
        extendProperties: {},
      },
    },
  },
  FileDataItem: {
    title: 'FileDataItem',
    type: 'object',
    required: [
      'type',
      'key',
      'value',
    ],
    additionalProperties: false,
    extendTypeAnnotation: '',
    extendAnnotation: '',
    extendProperties: {},
    properties: {
      type: {
        title: '\'file\'',
        type: 'string',
        enum: [
          'file',
        ],
        extendTypeAnnotation: '',
        extendAnnotation: '',
        extendProperties: {},
      },
      key: {
        title: 'string',
        type: 'string',
        extendTypeAnnotation: '',
        extendAnnotation: '',
        extendProperties: {},
      },
      value: {
        title: 'File',
        $ref: '#/definitions/File',
        extendTypeAnnotation: '',
        extendAnnotation: '',
        extendProperties: {},
      },
    },
  },
  File: {
    title: 'File',
    type: 'string',
    extendTypeAnnotation: '',
    extendAnnotation: '{format: \'data-url\'}',
    format: 'data-url',
    extendProperties: {
      format: 'data-url',
    },
    properties: {},
  },
  UriDataItem: {
    title: 'UriDataItem',
    type: 'object',
    required: [
      'type',
      'key',
      'value',
    ],
    additionalProperties: false,
    extendTypeAnnotation: '',
    extendAnnotation: '',
    extendProperties: {},
    properties: {
      type: {
        title: '\'uri\'',
        type: 'string',
        enum: [
          'uri',
        ],
        extendTypeAnnotation: '',
        extendAnnotation: '',
        extendProperties: {},
      },
      key: {
        title: 'string',
        type: 'string',
        extendTypeAnnotation: '',
        extendAnnotation: '',
        extendProperties: {},
      },
      value: {
        title: 'Uri',
        $ref: '#/definitions/Uri',
        extendTypeAnnotation: '',
        extendAnnotation: '',
        extendProperties: {},
      },
    },
  },
  Uri: {
    title: 'Uri',
    type: 'string',
    extendTypeAnnotation: '',
    extendAnnotation: '{format: \'uri\'}',
    format: 'uri',
    extendProperties: {
      format: 'uri',
    },
    properties: {},
  },
  DateTimeDataItem: {
    title: 'DateTimeDataItem',
    type: 'object',
    required: [
      'type',
      'key',
      'value',
    ],
    additionalProperties: false,
    extendTypeAnnotation: '',
    extendAnnotation: '',
    extendProperties: {},
    properties: {
      type: {
        title: '\'dateTime\'',
        type: 'string',
        enum: [
          'dateTime',
        ],
        extendTypeAnnotation: '',
        extendAnnotation: '',
        extendProperties: {},
      },
      key: {
        title: 'string',
        type: 'string',
        extendTypeAnnotation: '',
        extendAnnotation: '',
        extendProperties: {},
      },
      value: {
        title: 'DateTime',
        $ref: '#/definitions/DateTime',
        extendTypeAnnotation: '',
        extendAnnotation: '',
        extendProperties: {},
      },
    },
  },
  DateTime: {
    title: 'DateTime',
    type: 'string',
    extendTypeAnnotation: '',
    extendAnnotation: '{format: \'date-time\'}',
    format: 'date-time',
    extendProperties: {
      format: 'date-time',
    },
    properties: {},
  },
  EmailDataItem: {
    title: 'EmailDataItem',
    type: 'object',
    required: [
      'type',
      'key',
      'value',
    ],
    additionalProperties: false,
    extendTypeAnnotation: '',
    extendAnnotation: '',
    extendProperties: {},
    properties: {
      type: {
        title: '\'email\'',
        type: 'string',
        enum: [
          'email',
        ],
        extendTypeAnnotation: '',
        extendAnnotation: '',
        extendProperties: {},
      },
      key: {
        title: 'string',
        type: 'string',
        extendTypeAnnotation: '',
        extendAnnotation: '',
        extendProperties: {},
      },
      value: {
        title: 'Email',
        $ref: '#/definitions/Email',
        extendTypeAnnotation: '',
        extendAnnotation: '',
        extendProperties: {},
      },
    },
  },
  Email: {
    title: 'Email',
    type: 'string',
    extendTypeAnnotation: '',
    extendAnnotation: '{format: \'email\'}',
    format: 'email',
    extendProperties: {
      format: 'email',
    },
    properties: {},
  },
}
export default {
  DataItem: {
    ...schemaMap.DataItem,
    definitions: schemaMap,
  },
  DateDataItem: {
    ...schemaMap.DateDataItem,
    definitions: schemaMap,
  },
  Date: {
    ...schemaMap.Date,
    definitions: schemaMap,
  },
  StringDataItem: {
    ...schemaMap.StringDataItem,
    definitions: schemaMap,
  },
  BooleanDataItem: {
    ...schemaMap.BooleanDataItem,
    definitions: schemaMap,
  },
  FileDataItem: {
    ...schemaMap.FileDataItem,
    definitions: schemaMap,
  },
  File: {
    ...schemaMap.File,
    definitions: schemaMap,
  },
  UriDataItem: {
    ...schemaMap.UriDataItem,
    definitions: schemaMap,
  },
  Uri: {
    ...schemaMap.Uri,
    definitions: schemaMap,
  },
  DateTimeDataItem: {
    ...schemaMap.DateTimeDataItem,
    definitions: schemaMap,
  },
  DateTime: {
    ...schemaMap.DateTime,
    definitions: schemaMap,
  },
  EmailDataItem: {
    ...schemaMap.EmailDataItem,
    definitions: schemaMap,
  },
  Email: {
    ...schemaMap.Email,
    definitions: schemaMap,
  },
}
