import {
  Box, Button, Popover,
} from '@material-ui/core'
import Form from '@rjsf/material-ui'
import { EVENT } from '@utils/constants'
import { OnEvent } from '@type'
import { useDisclosure } from 'colay-ui'
import React from 'react'
import { getFormProps } from './getFormProps'

type LayoutOptionsValue = {
  name?: string;
  animationDuration?: number;
}
export type LayoutOptionsProps = {
  layout?: LayoutOptionsValue;
  onEvent: OnEvent;
}

export const LayoutOptions = (props: LayoutOptionsProps) => {
  const {
    layout = {},
    onEvent,
  } = props
  const {
    anchorEl,
    isOpen,
    onClose,
    onOpen,
  } = useDisclosure({})
  const onSubmitCallback = React.useCallback((e) => {
    onEvent({
      type: EVENT.LAYOUT_CHANGED,
      payload: {
        form: e,
        value: e.formData,
      },
    })
    onClose()
  }, [onEvent])
  return (

    <Box>
      <Button
        onClick={onOpen}
        sx={{
          color: (theme) => theme.palette.text.secondary,
        }}
      >
        {layout.name ?? 'Select Layout'}
      </Button>
      {/* <Popover
        open={isOpen}
        anchorEl={anchorEl}
        PaperProps={{
          style: {
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            position: 'absolute',
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 100,
          },
        }}
      /> */}
      <Popover
        // id={id}
        open={isOpen}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >

        <Box
          sx={{
            width: { sx: '10vw', md: '50vw' },
          }}
        >
          <Form
            {...getFormProps()}
            extraData={[layout]}
            formData={{
              name: layout.name,
              animationDuration: layout.animationDuration,
              refresh: layout.refresh,
              maxIterations: layout.maxIterations,
              maxSimulationTime: layout.maxSimulationTime,
            }}
            onSubmit={onSubmitCallback}
          />
        </Box>
      </Popover>

    </Box>
  )
}
