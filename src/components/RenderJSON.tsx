import React from 'react'
import { RenderNode } from '@type'
import * as R from 'colay/ramda'
import { DynamicRender, DynamicRenderProps } from 'colay-ui'
import { Graph } from './Graph'

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
        return R.path(value.split('.'), calculatedContext)
        // return json.path({
        //   json: calculatedContext,
        //   path: value,
        // })[0]
      }
      return value
    },
  )
  return (
    <DynamicRender
      components={Graph as unknown as DynamicRenderProps['components']}
      data={data}
    />
  )
}

export const mockRenderJSON: RenderJSONProps = {
  context: {} as unknown as RenderJSONProps['context'],
  ui: [
    [
      {
        id: '1',
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
            id: '1',
            type: 'Text',
            props: {},
            children: [{ id: '1', component: '$.label' }],
          },
        ],
      },
    ],
    [
      {
        id: '1',
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
            id: '1',
            type: 'Text',
            props: {},
            children: [{ id: '1', component: '$.label' }],
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
