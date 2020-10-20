import React from 'react'
import * as R from 'unitx/ramda'
import mingo from 'unitx/mingo'
import { ApplicationProvider, Button, Surface,useTheme, } from 'unitx-ui'
import { 
  DarkTheme,
  DefaultTheme,
} from 'unitx-ui'
import GraphEditor, { GraphEditorProps } from '../../src/editor/components/GraphEditor'
import { Graph } from '../../src/components'
import {drawLine} from '../../src/components/components/Graphics'
import data from './data'
import * as C from 'unitx/color'
import { FILTER_SCHEMA,  } from './constants'

type Props = Partial<GraphEditorProps>

const NODE_SIZE = {
  width: 80,
  height: 80,
}

const AppContainer = ({
  changeTheme,
  ...rest
}) => {
  const modalRef = React.useRef(null)
  const [state, setState] = React.useState({
    visible: false, 
    data,
    filteredData: data,
    filterData: { 
      'in_degree': [0, 20]
    }
})
  const onFilterChangeCallback = React.useCallback((filterData) => {
    setTimeout(
      () => {
        const processedFilterData = R.toMongoQuery({
          data: filterData,
        }, {
          processItem: (value, path) => R.cond([
            [R.equals(['data', 'in_degree']), () => ({ 
              $gte: value[0], $lte: value[1]
            })]
          ])(path)
        })

        const cursor = mingo.find(state.data.nodes, processedFilterData)
        const filteredData = cursor.all()
        setState({
          ...state,
          filterData,
          filteredData: {
            edges: filterEdges(filteredData)(state.filteredData.edges),
            nodes: filteredData
          },
        })
      }
    )
  }, [])
  const graphRef = React.useRef(null)
  const containerRef = React.useRef(null)
  const theme = useTheme()
  // const controller = useController({ nodes: [], edges: []}, {
  //   onAdd: () => {
  //     console.log()
  //     sync()
  //   }
  // })
  return (
      <Surface style={{ width: '100%', height: '100%'}}>
      <GraphEditor
        ref={graphRef}
        // controller={controller}
        extraData={{ theme }}
        style={{ width: '100%', height: '100%', }}
        graphConfig={{
          // layout: Graph.Layouts.breadthfirst,
          zoom: 0.5
        }}
        configExtractor={({ item, element }) => R.ifElse(
          R.isNil,
          () => ({
            filter: {
              onChange: onFilterChangeCallback,
              formData: state.filterData,
              ...FILTER_SCHEMA
            },
            action: {
              // renderMoreAction: () => (
              //     // <Menu.Item value="Show Clusters" title="Show Clusters"/>
              //     <Button onPress={() => setTimeout(() => changeTheme('dark'))}>Change Theme</Button>
              // )
            }
          }),
          () => {
            const schemaInfo = FILTER_SCHEMA
            // const schemaInfo = item.data.community === '27' 
            // ? FILTER_SCHEMA
            // : SECOND_FILTER_SCHEMA
            return {
              filter: {
                onChange: onFilterChangeCallback,
                formData: state.filterData,
                ...schemaInfo
              },
              data: {
                data: item.data
              }
            }
          }
          )(item)}
        drawLine={({ graphics, to, from }) => {
          drawLine({
            graphics,
            to,
            from,
            directed: true,
            box: {
              width: NODE_SIZE.width + 10,
              height: NODE_SIZE.height + 10
            },
            fill:C.rgbNumber(theme.colors.text)
            // type: 'bezier'
          })
        }}
        renderNode={({ item: { id, data } }) => {
          return (
            <Graph.HoverContainer
              style={{
                ...NODE_SIZE,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 25
                }}
                renderHoverElement={() => (
                  <Graph.View
                    style={{
                      width: NODE_SIZE.width * 2,
                      height: 20,
                      position: 'absolute',
                      left: 0,
                    }}
                  >
                    <Graph.Text style={{
                      fontSize: 20,
                       textAlign: 'center',
                      }}>
                      {R.replace('ECLI:NL:', '')(data.ecli)}
                    </Graph.Text>
                  </Graph.View>
                )}
            >
              <Graph.Text style={{fontSize: 10}}>
                {R.replace('ECLI:NL:', '')(data.ecli)}
              </Graph.Text>
            </Graph.HoverContainer>
          )
        }}
        {...state.filteredData}
        onFilterChange={onFilterChangeCallback}
        {...rest}
      />
      </Surface>
  )
}

export const mergeDeepAll = (list: Record<string, any>[]) => R.reduce(
  R.mergeDeepRight,
  // @ts-ignore
  {},
)(list)



const filterEdges = (nodes: {id: string}[]) => (edges: {source:string;target:string}[]) => {
  const nodeMap = R.groupBy(R.prop('id'))(nodes)
  return R.filter(
    (edge) => nodeMap[edge.source] && nodeMap[edge.target]
  )(edges)
}
export default (props: Props) => {
  const [isDefault, setIsDefault] = React.useState(true)
const changeTheme = () => {
  setIsDefault(!isDefault)
}

  return (
    <ApplicationProvider 
      theme={isDefault  ? DefaultTheme : DarkTheme}
    >
      <AppContainer  changeTheme={changeTheme} {...props}/>
    </ApplicationProvider>
  )
}