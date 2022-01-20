import {
  Collapsible,
  CollapsibleContainer,
  CollapsibleTitle,
} from '@components/Collapsible'
import { ResizeDivider } from '@components/ResizeDivider'
import { SIDE_PANEL_DEFAULT_HEIGHT, SIDE_PANEL_DEFAULT_WIDTH } from '@constants'
import { useGraphEditor } from '@hooks'
// import {
//   DataEditor,
// } from '../DataEditor'
import { useDrag } from '@hooks/useDrag'
import { Box, Button, Divider, Paper, Typography } from '@mui/material'
import { EdgeElement } from '@type'
import {
  useAnimation,
} from 'colay-ui'
import { View } from 'colay-ui/components/View'
import React from 'react'
import { ConnectedElements } from './ConnectedElements'
import { GlobalNetworkStatistics } from './GlobalNetworkStatistics'
import { JSONEditor } from './JSONEditor'
import { JSONViewer } from './JSONViewer'
import { LocalNetworkStatistics } from './LocalNetworkStatistics'

export type DataBarProps = {
  editable?: boolean;
  isOpen?: boolean;
  header?: React.FC;
  footer?: React.FC;
  sort?: any;
} // & Omit<DataEditorProps, 'data'>

export const DataBar = (props: DataBarProps) => {
  const {
    editable = false,
    isOpen = false,
    sort = -1,
    header: HeaderComponent,
    footer: FooterComponent,
  } = props

  const [
    {
      item,
      onEvent,
      networkStatistics,
      globalLabel,
      localLabel,
      isGlobalLabelFirst,
    },
  ] = useGraphEditor(
    (editor) => {
      const {
        selectedElement,
        selectedItem,
        label,
        localDataRef,
        networkStatistics,
      } = editor
      const targetPath = selectedElement?.isNode() ? 'nodes' : 'edges'
      const selectedItemId = selectedItem?.id!
      return {
        graphEditorConfig: editor.config,
        item: editor.selectedItem,
        localLabel: selectedElement && (label?.[targetPath][selectedItemId]),
        globalLabel: label?.global?.[targetPath],
        isGlobalLabelFirst: label?.isGlobalFirst?.[targetPath],
        onEvent: editor.onEvent,
        networkStatistics: {
          local: localDataRef.current!.networkStatistics!.local?.[selectedItemId],
          global: networkStatistics?.global?.[selectedItemId],
          sort: networkStatistics?.sort,
        },
        selectedElement,
      }
    },
  )
  const localDataRef = React.useRef({
    width: SIDE_PANEL_DEFAULT_WIDTH,
    height: SIDE_PANEL_DEFAULT_HEIGHT,
  })
  const {
    style: animationStyle,
    ref: animationRef,
  } = useAnimation({
    from: {
      width: 0,
    },
    to: {
      width: localDataRef.current.width,
    },
    autoPlay: false,
  }, [localDataRef.current.width])
  const containerRef = React.useRef<HTMLDivElement>()
  React.useEffect(() => {
    animationRef.current?.play?.(isOpen)
  }, [animationRef, isOpen])
  const hasStatistics = Object.values(networkStatistics).find((val) => val)
  const [state, setState] = React.useState({
    isEditing: false,
  })
  const onMouseDown = useDrag({
    ref: containerRef,
    onDrag: ({ x, y }, rect) => {
      // localDataRef.current.width = rect.width - x
      localDataRef.current.width = rect.width + x
      localDataRef.current.height = rect.height - y
      const target = containerRef.current!
      target.style.width = `${localDataRef.current.width}px`
      target.style.height = `${localDataRef.current.height}px`
    },
  })
  return (
    <Box
      ref={containerRef}
      style={{
        position: 'absolute',
        height: '60%',
        top: 2,
        right: 2,
        // width: animationStyle.right,
        ...animationStyle,
      }}
      
    >
      <Paper
        sx={{ 
          boxShadow: 2,
          borderColor: 'grey.500',
          // borderRadius: 5,
          borderWidth: 2,
          overflow: 'hidden',
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
      <View
        style={{
          height: '100%',
          flex: 1,
          // @ts-ignore
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {HeaderComponent && <HeaderComponent />}
        {item && (
        <Collapsible
          defaultIsOpen={ true}
        >
          {
            ({ isOpen, onToggle }) => (
              <>
            <CollapsibleTitle
              style={{
                wordBreak: 'break-word',
                padding: 2,
              }}
              onClick={onToggle}
            >
              {` id: ${item?.id}`}
            </CollapsibleTitle>
              {
                isOpen && (
                  <CollapsibleContainer>
            <View style={{
              width: '100%',
              height: hasStatistics ? '70%' : '100%',
              // wordWrap: 'break-word',
              // flexWrap: 'wrap',
            }}
            >
              {/* {
                isEdge && <EdgeElementSummary element={selectedElement} />
              } */}
              {
        editable
          && (
            // <DataEditor
            //   data={item.data}
            //   onEvent={onEvent}
            //   {...rest}
            // />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}
            >
              <Button
                onClick={() => setState({ ...state, isEditing: !state.isEditing })}
              >
                {state.isEditing ? 'Done' : 'Edit'}

              </Button>
            </View>
          )
      }
              {
        state.isEditing
          ? (
            <JSONEditor />
          )
          : (
            <JSONViewer
              sort={sort}
              localLabel={localLabel}
              globalLabel={globalLabel}
              isGlobalLabelFirst={isGlobalLabelFirst}
              data={item?.data ?? {}}
              onEvent={onEvent}
            />
          )
      }

            </View>
          </CollapsibleContainer>
                )
              }
              </>
            )
          }
        </Collapsible>

        )}
        <Divider />
        <ConnectedElements />
        {
        hasStatistics && (
          <View
            style={{
              height: '30%',
              width: '100%',
            }}
          >
            {
          networkStatistics.global && (
            <GlobalNetworkStatistics
              data={networkStatistics.global}
              sort={networkStatistics.sort?.global}
              onEvent={onEvent}
            />
          )
        }
            <Divider />
            {
          networkStatistics.local && (
            <LocalNetworkStatistics
              data={networkStatistics.local}
              sort={networkStatistics.sort?.local}
              onEvent={onEvent}
            />
          )
        }
          </View>
        )
      }
        {FooterComponent && <FooterComponent />}
      </View>
      <ResizeDivider
        onMouseDown={onMouseDown}
        isRight={false}
      />
      </Paper>
      
    </Box>
  )
}

type EdgeElementSummaryProps = {
  element: EdgeElement;
}
export const EdgeElementSummary = (props: EdgeElementSummaryProps) => {
  const {
    element,
  } = props
  const sourceId = element.source().id()
  const targetId = element.target().id()
  return (
    <View>
      <View style={{ flexDirection: 'row' }}>
        <Typography variant="subtitle1">source:</Typography>
        <Typography>{` ${sourceId}`}</Typography>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Typography variant="subtitle1">target:</Typography>
        <Typography>{` ${targetId}`}</Typography>
      </View>
    </View>
  )
}

export const isValidURL = (value: string) => {
  let url
  try {
    url = new URL(value)
  } catch (_) {
    return false
  }
  return url.protocol === 'http:' || url.protocol === 'https:'
}
