import React from 'react'
import { RenderNode } from '@type'
import * as R from 'unitx/ramda'
import json from 'unitx/json'
import Graph from './Graph'
import { DynamicRender, DynamicRenderProps } from './DynamicRender'

export type RenderJSONProps = {
  params?: string;
  select?: string;
  context: Parameters<RenderNode>[0];
  ui: DynamicRenderProps['data'][];
}
const runFunctionByString = (
  functionString: string,
  params: any[] = [],
) => Function(`"use strict";return (${functionString})`)()(
  ...params,
)

export const RenderJSON = (props: RenderJSONProps) => {
  const {
    context,
    ui,
    select,
    params,
  } = props
  context.ui = ui
  context.params = React.useMemo(
    () => (params ? runFunctionByString(params, [context]) : {}),
    [params, context],
  )
  const selectedUI = React.useMemo(
    () => (select ? runFunctionByString(select, [context]) : ui[0]),
    [ui, context, select],
  )
  const data = R.traverseJSON(
    selectedUI,
    (value) => {
      if (typeof value === 'string' && value.startsWith('$.')) {
        return json.path({
          json: context,
          path: value,
        })[0]
      }
      return value
    },
  )
  return (
    <DynamicRender
      components={Graph}
      data={data}
    />
  )
}

export const mockRenderJSON: RenderJSONProps = {
  ui: [
    [
      {
        type: 'View',
        props: {
          style: {
            width: 100,
            height: 100,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 50,
            backgroundColor: '$.params.color',
          },
        },
        children: [
          {
            type: 'Text',
            props: {},
            children: [{ component: '$.label' }],
          },
        ],
      },
    ],
    [
      {
        type: 'View',
        props: {
          style: {
            width: 100,
            height: 100,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '$.params.color',
          },
        },
        children: [
          {
            type: 'Text',
            props: {},
            children: [{ component: '$.label' }],
          },
        ],
      },
    ],
  ],
  select: `function(context) {
    return context.item.id > '3'
      ? context.ui[0]
      : context.ui[1]
  }`,
  params: `function(context) {
    return {
      color: context.element.selected() ? 'red' : 'blue'
    }
  }`,
}
