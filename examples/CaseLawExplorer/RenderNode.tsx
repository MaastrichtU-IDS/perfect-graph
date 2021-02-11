import React from 'react'
import * as R from 'colay/ramda'
import * as PIXI from 'pixi.js'
import { Graph,  } from '../../src/components'
import { RenderNode as RenderNodeType,  } from '../../src/type'


export type RenderNodeProps = Parameters<RenderNodeType>[0]

const DEFAULT_FONT_SIZE = 16
export const RenderNode = ({
   item, element, cy, theme,
   visualization, 
   filtering,
  graphRef 
}: RenderNodeProps) => {
  const text = R.takeLast(6, item.id)
  const size = calculateNodeSize(item.data, visualization.nodeSize)
  const color = visualization.nodeColor ? calculateColor(
    item.data,
    visualization.nodeColor
  ) : theme.palette.background.paper
  const hasSelectedEdge = element.connectedEdges(':selected').length > 0
  const textRef = React.useRef(null)
  const configRef = React.useRef({
    fontSize: DEFAULT_FONT_SIZE
  })
  React.useEffect(() => {
    if (graphRef.current.viewport) {
      graphRef.current.viewport.on('zoomed',() => {
        const xScale = 1/graphRef.current.viewport.scale.x
        const yScale = 1/graphRef.current.viewport.scale.y
        if (xScale > 1 && xScale < 5){
          textRef.current.scale.x = xScale
        textRef.current.scale.y = yScale
        }
      })
    }
    
  }, [graphRef.current.viewport])
  
  // const year = new Date(item.data.date).getFullYear()
  // console.log(filtering.year[0],filtering.year[1], year)
  // const filterVisibility = R.inBetween(filtering.year[0],filtering.year[1])(new Date(item.data.date).getFullYear())
  // const context = element.data().context
  // if (context.settings.visibility.filter !== filterVisibility) {
  //   context.settings.visibility.filter = filterVisibility
  //   element.data({
  //     context
  //   })
  // }
  // console.log(year, filterVisibility)
  return (
    <Graph.Pressable
      style={{
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        backgroundColor: hasSelectedEdge
        ? theme.palette.secondary.main
        : (element.selected()
          ? theme.palette.primary.main
          : color),
        // hasSelectedEdge
        //   ? theme.palette.secondary.main
        //   : (element.selected()
        //     ? theme.palette.primary.main
        //     : theme.palette.background.paper),
        borderRadius: size,
      }}
      onPress={(e) => {
        cy.$(':selected').unselect()
        element.select()
      }}
    >
      <Graph.Text
        ref={textRef}
        style={{
          position: 'absolute',
          top: -size/1.5,
          left: 20,
          fontSize: configRef.current.fontSize
        }}
        isSprite
      >
        {text}
      </Graph.Text>
    </Graph.Pressable>
  )
}

const NODE_SIZE = {
  width: 80,
  height: 80,
}

const NODE_SIZE_RANGE_MAP = {
  size: [60, 250],
  community: [0, 10],
  in_degree: [0, 10],
  out_degree: [0, 10],
  degree: [0, 20],
  year: [
    1969,
    2015
  ],
}
const calculateNodeSize = (data: object, fieldName?: keyof typeof NODE_SIZE_RANGE_MAP) => {
  if (!fieldName) {
    return NODE_SIZE_RANGE_MAP.size[0]
  }
  const fieldRange = NODE_SIZE_RANGE_MAP[fieldName]
  const sizeRangeGap = NODE_SIZE_RANGE_MAP.size[1] - NODE_SIZE_RANGE_MAP.size[0]
  const fieldRangeGap = fieldRange[1] - fieldRange[0]
  const fieldRangeValue = (data[fieldName] ?? fieldRange[0]) - fieldRange[0]
  return  ((fieldRangeValue / fieldRangeGap) * sizeRangeGap) + NODE_SIZE_RANGE_MAP.size[0]
}
const calculateColor = (data: object, fieldName?: keyof typeof NODE_SIZE_RANGE_MAP) => {
  if (!fieldName) {
    return perc2color(0)
  }
  const fieldRange = NODE_SIZE_RANGE_MAP[fieldName]
  const sizeRangeGap = NODE_SIZE_RANGE_MAP.size[1] - NODE_SIZE_RANGE_MAP.size[0]
  const fieldRangeGap = fieldRange[1] - fieldRange[0]
  const fieldRangeValue = (data[fieldName] ?? fieldRange[0]) - fieldRange[0]
  return  perc2color((fieldRangeValue / fieldRangeGap) * 100)
}
const perc2color = (
  perc: number,
  min = 20, 
  max = 80
) => {
  var base = (max - min);

  if (base === 0) { perc = 100; }
  else {
      perc = (perc - min) / base * 100; 
  }
  var r, g, b = 0;
  if (perc < 50) {
      r = 255;
      g = Math.round(5.1 * perc);
  }
  else {
      g = 255;
      r = Math.round(510 - 5.10 * perc);
  }
  var h = r * 0x10000 + g * 0x100 + b * 0x1;
  return '#' + ('000000' + h.toString(16)).slice(-6);
}
