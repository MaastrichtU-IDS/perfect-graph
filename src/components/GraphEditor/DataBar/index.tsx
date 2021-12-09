import { Icon } from '@components/Icon'
import { useGraphEditor } from '@hooks'
import {
  Accordion, AccordionDetails,
  AccordionSummary, Divider, IconButton, Paper, Typography,
  Button, Box,
} from '@mui/material'
import { EVENT, SIDE_PANEL_DEFAULT_WIDTH } from '@constants'
import { EdgeElement } from '@type'
import {
  useAnimation,
} from 'colay-ui'
import { View } from 'colay-ui/components/View'
import * as R from 'colay/ramda'
import React from 'react'
// import {
//   DataEditor,
// } from '../DataEditor'
import { useDrag } from '@hooks/useDrag'
import { ResizeDivider } from '@components/ResizeDivider'
import { JSONEditor } from './JSONEditor'
import { GlobalNetworkStatistics } from './GlobalNetworkStatistics'
import { LocalNetworkStatistics } from './LocalNetworkStatistics'
import { ConnectedElements } from './ConnectedElements'
import { JSONViewer } from './JSONViewer'

export type DataBarProps = {
  editable?: boolean;
  isOpen?: boolean;
  header?: React.FC;
  footer?: React.FC;
  sort?: any;
} // & Omit<DataEditorProps, 'data'>

const ICON_SIZE = 16

export const DataBar = (props: DataBarProps) => {
  const {
    editable = true,
    isOpen = false,
    sort = -1,
    header: HeaderComponent,
    footer: FooterComponent,
    ...rest
  } = props

  const [
    {
      item,
      onEvent,
      networkStatistics,
      globalLabel,
      localLabel,
      isGlobalLabelFirst,
      selectedElement,
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
      return {
        graphEditorConfig: editor.config,
        item: editor.selectedItem,
        localLabel: selectedElement && (label?.[targetPath][selectedItem?.id!]),
        globalLabel: label?.global?.[targetPath],
        isGlobalLabelFirst: label?.isGlobalFirst?.[targetPath],
        onEvent: editor.onEvent,
        networkStatistics: {
          local: localDataRef.current!.networkStatistics!.local?.[selectedItem?.id!],
          global: networkStatistics?.global?.[selectedItem?.id!],
          sort: networkStatistics?.sort,
        },
        selectedElement,
      }
    },
  )
  const localDataRef = React.useRef({
    width: SIDE_PANEL_DEFAULT_WIDTH,
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
  const containerRef = React.useRef()
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
      localDataRef.current.width = rect.width + x
      const target = containerRef.current
      target.style.width = `${localDataRef.current.width}px`
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
          borderRadius: 5,
          borderWidth: 2,
          overflow: 'hidden',
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
      <ResizeDivider
        onMouseDown={onMouseDown}
      />
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
        <Accordion
          defaultExpanded
        >
          <AccordionSummary>
            <Typography
              variant="h6"
              style={{
                wordBreak: 'break-word',
                padding: 2,
              }}
            >
              {` id: ${item?.id}`}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
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
        editable && item?.data
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
              data={item?.data}
              onEvent={onEvent}
            />
          )
      }

            </View>
          </AccordionDetails>
        </Accordion>

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

      </Paper>
      <IconButton
        style={{
          position: 'absolute',
          left: -34,
          top: 0,
          fontSize: 24,
        }}
        onClick={() => {
          onEvent({
            type: EVENT.TOGGLE_DATA_BAR,
            avoidHistoryRecording: true,
          })
        }}
      >
        <Icon
          name="info_outlined"
        />
      </IconButton>
    </Box>
  )
}

type EdgeElementSummaryProps = {
  element: EdgeElement;
}
const EdgeElementSummary = (props: EdgeElementSummaryProps) => {
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
