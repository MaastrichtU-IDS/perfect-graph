import { Icon } from '@components/Icon'
import { useGraphEditor } from '@hooks'
import {
  Accordion, AccordionDetails, AccordionSummary, Divider, IconButton, Paper, Typography,
} from '@material-ui/core'
import { EVENT } from '@constants'
import {
  JSONViewer,
  useAnimation,
} from 'colay-ui'
import { View } from 'colay-ui/components/View'
import * as R from 'colay/ramda'
import React from 'react'
import {
  DataEditor,
} from '../DataEditor'
import { GlobalNetworkStatistics } from './GlobalNetworkStatistics'
import { LocalNetworkStatistics } from './LocalNetworkStatistics'

export type DataBarProps = {
  editable?: boolean;
  isOpen?: boolean;
  header?: React.FC;
  footer?: React.FC;
} // & Omit<DataEditorProps, 'data'>

const WIDTH_PROPORTION = 40
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
    },
  ] = useGraphEditor(
    (editor) => {
      const {
        selectedElement,
        selectedItem,
        label,
        localDataRef,
        networkStatistics
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
          global: networkStatistics?.global ?? localDataRef.current!.networkStatistics!.local?.[selectedItem?.id!],
        },
      }
    },
  )

  const {
    style: animationStyle,
    ref: animationRef,
  } = useAnimation({
    from: {
      right: `-${WIDTH_PROPORTION}%`,
    },
    to: {
      right: '0%',
    },
    autoPlay: false,
  })
  React.useEffect(() => {
    animationRef.current?.play?.(isOpen)
  }, [animationRef, isOpen])
  const hasStatistics = Object.values(networkStatistics).find((val) => val)
  return (
    <Paper
      style={{
        position: 'absolute',
        width: `${WIDTH_PROPORTION}%`,
        height: '100%',
        top: 0,
        ...animationStyle,
      }}
    >
      <View
        style={{
          height: '100%',
          width: '100%',
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
              // style={{ marginLeft: 2 }}
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
              {
        editable && item?.data
          ? (
            <DataEditor
              data={item.data}
              onEvent={onEvent}
              {...rest}
            />
          )
          : (
            <JSONViewer
              extraData={[localLabel, globalLabel]}
              data={item?.data}
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
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    style={{ alignContent: 'center' }}
                  >
                    {`${key}${value ? ': ' : ''}`}
                  </Typography>
                  {value
                    ? (
                      <Typography
                        variant="subtitle1"
                        // noWrap
                        display="inline"
                        style={{ alignContent: 'center' }}
                      >
                        {value}
                      </Typography>
                    )
                    : null}
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
