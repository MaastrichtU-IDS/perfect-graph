import { Icon } from '@components/Icon'
import { useGraphEditor } from '@hooks'
import {
  Accordion, AccordionDetails,
  AccordionSummary, Divider, IconButton, Paper, Typography,
  Button,
} from '@material-ui/core'
import { EVENT, SIDE_PANEL_DEFAULT_WIDTH } from '@constants'
import { EdgeElement } from '@type'
import {
  JSONViewer,
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

export type DataBarProps = {
  editable?: boolean;
  isOpen?: boolean;
  header?: React.FC;
  footer?: React.FC;
} // & Omit<DataEditorProps, 'data'>

const ICON_SIZE = 16

export const DataBar = (props: DataBarProps) => {
  const {
    editable = true,
    isOpen = false,
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
          global: (networkStatistics?.global ?? localDataRef.current!.networkStatistics!.local)?.[selectedItem?.id!],
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
    <Paper
      ref={containerRef}
      style={{
        position: 'absolute',
        height: '100%',
        top: 0,
        display: 'flex',
        flexDirection: 'row',
        right: 0,
        // width: animationStyle.right,
        ...animationStyle,
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
              extraData={[localLabel, globalLabel]}
              data={item?.data}
              sort={-1}
              left={(props) => {
                const {
                  item: { path },
                  collapsed, onCollapse, noChild,
                } = props
                const isLocalLabel = R.equals(path, localLabel)
                const isGlobalLabel = R.equals(path, globalLabel)
                return (
                  <>

                    <IconButton
                      size="small"
                      sx={{ height: ICON_SIZE }}
                      onClick={() => onEvent(
                        isLocalLabel
                          ? {
                            type: EVENT.CLEAR_NODE_LOCAL_LABEL,
                          }
                          : {
                            type: EVENT.SET_NODE_LOCAL_LABEL,
                            payload: {
                              value: path,
                            },
                          },
                      )}
                    >
                      <Icon
                        style={{
                          fontSize: ICON_SIZE,
                          textDecoration: !isGlobalLabelFirst ? 'underline' : '',
                        }}
                        name={
                          isLocalLabel ? 'bookmark' : 'bookmark_border'
                        }
                      />
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{ height: ICON_SIZE }}
                      onClick={() => onEvent(
                        isGlobalLabel
                          ? {
                            type: EVENT.CLEAR_NODE_GLOBAL_LABEL,
                          }
                          : {
                            type: EVENT.SET_NODE_GLOBAL_LABEL,
                            payload: {
                              value: path,
                            },
                          },
                      )}
                    >
                      <Icon
                        style={{
                          fontSize: ICON_SIZE,
                          textDecoration: isGlobalLabelFirst ? 'underline' : '',
                        }}
                        name={
                          isGlobalLabel ? 'bookmarks' : 'bookmark_border'
  }
                      />
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{ height: ICON_SIZE }}
                      disabled={noChild}
                      onClick={() => onCollapse(!collapsed)}
                    >
                      <Icon
                        style={{
                          fontSize: ICON_SIZE, // noChild ? 12 : ICON_SIZE,
                        }}
                        name={
                      noChild
                        ? 'fiber_manual_record'
                        : collapsed
                          ? 'arrow_drop_down_rounded'
                          : 'arrow_drop_up_rounded'
}
                      />
                    </IconButton>
                  </>
                )
              }}
              renderItem={({ item: { key, value } }) => (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    style={{
                      alignContent: 'center',
                      flexDirection: 'row',
                      width: '100%',
                      wordWrap: 'break-word',
                    }}
                  >
                    {`${key}${value ? ': ' : ''}`}
                    {value
                      ? (
                        <Typography
                          variant="subtitle1"
                          component={isValidURL(value) ? 'a' : 'span'}
                          align="center"
                          href={value}
                          target="_blank"
                          style={{ wordWrap: 'break-word' }}
                        >
                          {value}
                        </Typography>
                      )
                      : null}
                  </Typography>

                </View>
              )}
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
              onEvent={onEvent}
            />
          )
        }
            <Divider />
            {
          networkStatistics.local && (
            <LocalNetworkStatistics
              data={networkStatistics.local}
              onEvent={onEvent}
            />
          )
        }
          </View>
        )
      }
        {FooterComponent && <FooterComponent />}
      </View>

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
    </Paper>
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
