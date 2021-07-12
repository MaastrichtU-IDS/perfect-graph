import React from 'react'

export const  useLayout = ()  =>{
  const [layout, setLayout] = React.useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    initialized: false,
  })
  const onLayout = React.useCallback((e) => setLayout({ ...e.nativeEvent.layout, initialized: true }), [])

  return {
    onLayout,
    ...layout,
  }
}