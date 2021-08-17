import React from 'react'
import { ReactHTMLElementProps } from 'colay-ui/type'

export type ResizeDividerProps = ReactHTMLElementProps<HTMLDivElement>
export const ResizeDivider = (props: ResizeDividerProps) => {
  const [state, setState] = React.useState({
    onHover: false,
  })
  return (
    <div
      style={{
        width: state.onHover ? 4 : 2,
        height: '100%',
        backgroundColor: 'black',
        cursor: 'col-resize',
        ...(props?.style ?? {}),
      }}
      onMouseEnter={() => setState({ ...state, onHover: true })}
      onMouseLeave={() => setState({ ...state, onHover: false })}
      {...props}
    />
  )
}
