import React from 'react'
import { RenderNode } from '@type'
import * as R from 'unitx/ramda'
import json from 'unitx/json'
import Graph from './Graph'
import { DynamicRender, DynamicRenderProps } from './DynamicRender'

type RenderJSONContext = Parameters<RenderNode>[0]

export type RenderJSONProps = {
  params?: string;
  select?: string;
  context: RenderJSONContext;
  ui: DynamicRenderProps['data'][];
}
type RenderJSONCalculatedContext = RenderJSONContext & {
  ui: RenderJSONProps['ui'];
  params: any;
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
  const calculatedContext = { ...context } as RenderJSONCalculatedContext
  calculatedContext.ui = ui
  calculatedContext.params = React.useMemo(
    () => (params ? runFunctionByString(params, [calculatedContext]) : {}),
    [params, context],
  )
  const selectedUI = React.useMemo(
    () => (select ? runFunctionByString(select, [calculatedContext]) : ui[0]),
    [ui, context, select],
  )
  const data = R.traverseJSON(
    selectedUI,
    (value) => {
      if (typeof value === 'string' && value.startsWith('$.')) {
        return json.path({
          json: calculatedContext,
          path: value,
        })[0]
      }
      return value
    },
  )
  return (
    <DynamicRender
      // @ts-ignore
      components={Graph}
      data={data}
    />
  )
}

export const mockRenderJSON: RenderJSONProps = {
  // @ts-ignore
  context: {},
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
