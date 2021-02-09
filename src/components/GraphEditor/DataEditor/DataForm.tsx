import React from 'react'
import Form from '@rjsf/semantic-ui'
// import Form from '@rjsf/semantic-ui'
import { Box } from '@material-ui/core'
import { EVENT } from '@utils/constants'

export type DataEditorProps = {
  style?: BoxProps['style'];
  data: DataItem[];
  onEvent: (param: {
    type: EventType;
    extraData: any;
    index?: number;
    item?: DataItem;
  }) => void;
  localLabel?: string[]| null;
  globalLabel?: string[] | null;
  isGlobalLabelFirst?: boolean;
}

export const DataForm = (props: DataEditorProps) => {
  const {
    data,
    onEvent,
  } = props
  return (
    <Box
      sx={{
        overflow: 'scroll',
        height: '100%',
        pb: 12,
      }}
    >
      <Form
        formData={data ?? []}
        onSubmit={(e) => onEvent({
          type: EVENT.UPDATE_DATA,
          extraData: {
            value: e.formData,
          },
        })}
        schema={{
          title: 'DataEditor',
          type: 'array',
          items: {
            required: ['name', 'value'],
            type: 'object',
            properties: {
              name: {
                title: 'Name',
                type: 'string',
              },
              value: {
                title: 'Value List',
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    value: {
                      title: 'Item',
                      type: 'string',
                    },
                    additional: {
                      title: 'Item Additional List',
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          name: {
                            title: 'Additional Name',
                            type: 'string',
                          },
                          value: {
                            title: 'Additional Value',
                            type: 'string',
                          },
                        },
                      },
                    },
                  },
                },
              },
              // additional: {
              //   type: 'object',
              //   properties: {
              //     name: {
              //       type: 'string',
              //     },
              //     value: {
              //       type: 'array',
              //       items: {
              //         type: 'string',
              //       },
              //     },
              //   },
              // },
            },
          },
        }}
      />
    </Box>
  )
}

const SCHEMA = {
  title: 'DataEditor',
  type: 'array',
  items: {
    required: ['name', 'value'],
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
      value: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
      additional: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          value: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      },
    },
  },
}
