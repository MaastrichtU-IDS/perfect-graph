import React from 'react'
import { ReactHTMLElementProps } from 'colay-ui/type'

export type ResizeDividerProps = ReactHTMLElementProps<HTMLDivElement>
export const ResizeDivider = (props: ResizeDividerProps) => {
  const {
    isRight = true,
  } = props
  const [state, setState] = React.useState({
    onHover: false,
  })
  const thickness = state.onHover ? 4 : 4
  const MARGIN = 0
  return (
    <div
      style={{
        width: thickness,
        height: thickness,
        // backgroundColor: 'black',
        cursor: isRight ? 'nwse-resize' : 'nesw-resize',
        position: 'absolute',
        bottom: MARGIN,
        ...(isRight ? { right: MARGIN } : { left: MARGIN }),
        borderColor: 'black',
        borderStyle: 'double',
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        ...(
          isRight
            ? { borderRightWidth: thickness }
            : { borderLeftWidth: thickness }
        ),
        borderBottomWidth: thickness,
        ...(props?.style ?? {}),
      }}
      onMouseEnter={() => setState({ ...state, onHover: true })}
      onMouseLeave={() => setState({ ...state, onHover: false })}
      {...props}
    />
  )
}
