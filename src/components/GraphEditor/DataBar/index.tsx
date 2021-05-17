import React from 'react'
import { EVENT } from '@utils/constants'
import {
  OnEventLite, ElementData, GraphEditorConfig,
} from '@type'
import {
  JSONViewer,
  useAnimation,
} from 'colay-ui'
import { View } from 'colay-ui/components/View'
import {
  IconButton,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@material-ui/core'
import { Icon } from '@components/Icon'
import * as R from 'colay/ramda'
import { useGraphEditor } from '@hooks'
import {
  DataEditor,
  // DataEditorProps,
} from '../DataEditor'
import { LocalNetworkStatistics } from './LocalNetworkStatistics'
import { GlobalNetworkStatistics } from './GlobalNetworkStatistics'

export type DataBarProps = {
  editable?: boolean;
  opened?: boolean;
} // & Omit<DataEditorProps, 'data'>

const WIDTH_PROPORTION = 40
const ICON_SIZE = 16

export const DataBar = (props: DataBarProps) => {
  const {
    editable = true,
    opened = false,
    ...rest
  } = props

  const [
    {
      item,
      onEvent,
      statistics,
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
      } = editor
      const targetPath = selectedElement?.isNode() ? 'nodes' : 'edges'
      return {
        graphEditorConfig: editor.config,
        item: editor.selectedItem,
        localLabel: selectedElement && (label?.[targetPath][selectedItem?.id!]),
        globalLabel: label?.global?.[targetPath],
        isGlobalLabelFirst: label?.isGlobalFirst?.[targetPath],
        onEvent: editor.onEvent,
        statistics: {
          localNetworkStatistics: localDataRef.current.localNetworkStatistics?.[selectedItem?.id],
          globalNetworkStatistics: localDataRef.current.localNetworkStatistics?.[selectedItem?.id],
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
    animationRef.current?.play?.(opened)
  }, [animationRef, opened])
  const hasStatistics = Object.values(statistics).find((val) => val)
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
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
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
          statistics.globalNetworkStatistics && (
            <GlobalNetworkStatistics
              data={statistics.globalNetworkStatistics}
              onEvent={onEvent}
            />
          )
        }
            <Divider />
            {
          statistics.localNetworkStatistics && (
            <LocalNetworkStatistics
              data={statistics.localNetworkStatistics}
              onEvent={onEvent}
            />
          )
        }
          </View>
        )
      }
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
