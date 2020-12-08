import { useStateWithCallback } from 'unitx-ui/hooks'
import { EdgeSingular } from 'cytoscape'
import React, { useEffect, useMemo, useRef } from 'react'
import {
  EdgeContext, ElementConfig, EdgeElement,
} from '@type'
import { mutableGraphMap } from './useGraph'
import { useElement } from './useElement'

export type Props<T> = {
  children?: React.ReactNode;
  id: string;
  source: string;
  target: string;
  graphID: string;
  onPositionChange?: (c: {element: EdgeSingular; context: EdgeContext }) => void;
  config?: ElementConfig;
}

type Result<T> = {
  element: EdgeSingular;
  context: EdgeContext;
}

export default <T>(props: Props<T>): Result<T> => {
  const {
    id,
    source,
    target,
    onPositionChange,
    graphID,
    config,
  } = props
  const { cy } = mutableGraphMap[graphID]
  const [, setState] = useStateWithCallback({}, () => {
  })
  const contextRef = useRef<EdgeContext>({
    render: (callback: () => {}) => {
      setState({}, callback)
    },
    element: null as unknown as EdgeElement,
  } as EdgeContext)

  contextRef.current.element = useMemo(() => {
    const {
      current: {
        element,
      },
    } = contextRef
    if (element) {
      cy.remove(element)
    }
    return cy!.add({
      data: {
        id,
        source,
        target,
        onPositionChange: () => {
        onPositionChange?.({
          // @ts-ignore
          element: contextRef.current.element,
          context: contextRef.current,
        })
        },
      },
      group: 'edges',
    })
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [cy, id, source, target])
  const {
    current: {
      element,
    },
  } = contextRef
  useEffect(
    () => {
      element.data(
        'onPositionChange', () => {
        onPositionChange?.({ element, context: contextRef.current })
        },
      )
    },
    [onPositionChange],
  )

  useEffect(() => () => { cy!.remove(element!) },
  // eslint-disable-next-line react-hooks/exhaustive-deps
    [cy, id, source, target])

  useElement({
    contextRef,
    cy,
    element,
    config,
  })
  return {
    element,
    context: contextRef.current,
  }
}
