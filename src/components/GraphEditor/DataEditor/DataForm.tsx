import React from 'react'
// @ts-ignore
import Form from '@rjsf/semantic-ui'
// import Form from '@rjsf/semantic-ui'
import { Box, BoxProps } from '@mui/material'
import { EVENT } from '@constants'
import { OnEventLite, DataItem } from '@type'

export type DataEditorProps = {
  style?: BoxProps['style'];
  data: DataItem[];
  onEvent: OnEventLite;
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
        onSubmit={(e: React.MouseEvent<HTMLButtonElement>) => onEvent({
          type: EVENT.UPDATE_DATA,
          payload: {
            // @ts-ignore
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
