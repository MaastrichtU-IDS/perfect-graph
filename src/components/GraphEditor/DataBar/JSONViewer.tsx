import {Icon} from '@components/Icon'
import {EVENT} from '@constants'
import {IconButton, Typography} from '@mui/material'
import {View} from 'colay-ui/components/View'
import * as R from 'colay/ramda'
import React from 'react'
import {JSONViewer as JSONViewerNative} from 'colay-ui'
import {isValidURL} from '@utils'
import {OnEventLite} from '@type'

export type DataBarProps = {
  data: any
  sort?: any
  localLabel?: any
  globalLabel?: any
  isGlobalLabelFirst?: boolean
  onEvent?: OnEventLite
} // & Omit<DataEditorProps, 'data'>

const ICON_SIZE = 12
const TEXT_VARIANT = 'subtitle2'
const COLUMN_HEIGHT = 32
export const JSONViewer = (props: DataBarProps) => {
  const {localLabel, globalLabel, data, isGlobalLabelFirst, onEvent = () => {}, sort} = props

  return (
    <JSONViewerNative
      extraData={[localLabel, globalLabel]}
      data={data}
      sort={sort}
      left={props => {
        const {
          item: {path},
          collapsed,
          onCollapse,
          noChild
        } = props
        const isLocalLabel = R.equals(path, localLabel)
        const isGlobalLabel = R.equals(path, globalLabel)
        return (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: COLUMN_HEIGHT
            }}
          >
            {localLabel && (
              <IconButton
                sx={{
                  height: ICON_SIZE,
                  width: ICON_SIZE
                }}
                onClick={() =>
                  onEvent(
                    isLocalLabel
                      ? {
                          type: EVENT.CLEAR_NODE_LOCAL_LABEL
                        }
                      : {
                          type: EVENT.SET_NODE_LOCAL_LABEL,
                          payload: {
                            value: path
                          }
                        }
                  )
                }
              >
                <Icon
                  style={{
                    fontSize: ICON_SIZE,
                    textDecoration: !isGlobalLabelFirst ? 'underline' : ''
                  }}
                  name={isLocalLabel ? 'bookmark' : 'bookmark_border'}
                />
              </IconButton>
            )}
            {globalLabel && (
              <IconButton
                sx={{height: ICON_SIZE, width: ICON_SIZE}}
                onClick={() =>
                  onEvent(
                    isGlobalLabel
                      ? {
                          type: EVENT.CLEAR_NODE_GLOBAL_LABEL
                        }
                      : {
                          type: EVENT.SET_NODE_GLOBAL_LABEL,
                          payload: {
                            value: path
                          }
                        }
                  )
                }
              >
                <Icon
                  style={{
                    fontSize: ICON_SIZE,
                    textDecoration: isGlobalLabelFirst ? 'underline' : ''
                  }}
                  name={isGlobalLabel ? 'bookmarks' : 'bookmark_border'}
                />
              </IconButton>
            )}
            <IconButton
              sx={{height: ICON_SIZE, width: ICON_SIZE}}
              disabled={noChild}
              onClick={() => onCollapse(!collapsed)}
            >
              <Icon
                style={{
                  fontSize: noChild ? ICON_SIZE - 2 : ICON_SIZE + 2
                }}
                name={noChild ? 'fiber_manual_record' : collapsed ? 'arrow_drop_down_rounded' : 'arrow_drop_up_rounded'}
              />
            </IconButton>
          </View>
        )
      }}
      renderItem={({item: {key, value}}) => (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            minHeight: COLUMN_HEIGHT
          }}
        >
          <Typography
            variant={TEXT_VARIANT}
            style={{
              alignContent: 'center',
              flexDirection: 'row',
              width: '100%',
              wordWrap: 'break-word'
            }}
          >
            {`${key}${!R.isNil(value) ? ': ' : ''}`}
            {!R.isNil(value) ? (
              <Typography
                variant={TEXT_VARIANT}
                component={isValidURL(value) ? 'a' : 'span'}
                align="center"
                href={value}
                target="_blank"
                style={{wordWrap: 'break-word'}}
              >
                {value}
              </Typography>
            ) : null}
          </Typography>
        </View>
      )}
    />
  )
}
