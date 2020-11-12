import { useStateWithCallback } from 'unitx-ui/hooks'
import { EdgeSingular } from 'cytoscape'
import React, { useEffect, useMemo, useRef } from 'react'
import { Context } from '@type'
import { mutableGraphMap } from './useGraph'

export type Props<T> = {
  children?: React.ReactNode;
  id: string;
  source: string;
  target: string;
  graphID: string;
  onPositionChange?: (c: {element: EdgeSingular; context: Context }) => void;
}

type Result<T> = {
  element: EdgeSingular;
  context: Context;
}

export default <T>(props: Props<T>): Result<T> => {
  const {
    id,
    source,
    target,
    onPositionChange,
    graphID,
  } = props
  const mutableCy = mutableGraphMap[graphID]
  const [, setState] = useStateWithCallback({}, () => {
  })
  const contextRef = useRef<Context>({
    render: (callback: () => {}) => {
      setState({}, callback)
    },
  } as Context)

  const element = useMemo(() => mutableCy!.add({
    data: {
      id,
      source,
      target,
      onPositionChange: () => {
        onPositionChange?.({ element, context: contextRef.current })
      },
    },
    group: 'edges',
  }),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [mutableCy, id, source, target])
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

  useEffect(() => () => { mutableCy!.remove(element!) },
  // eslint-disable-next-line react-hooks/exhaustive-deps
    [mutableCy, id, source, target])
  return {
    element,
    context: contextRef.current,
  }
}
