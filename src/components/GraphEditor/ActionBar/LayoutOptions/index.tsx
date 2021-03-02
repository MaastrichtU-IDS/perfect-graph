import {
  Box, Button, Popover
} from '@material-ui/core'
import Form from '@rjsf/material-ui'
import { EVENT } from '@utils/constants'
import { useDisclosure } from 'colay-ui'
import React from 'react'
import { getFormProps } from './getFormProps'

type LayoutOptionsValue = {
  name?: string;
  animationDuration?: number;
}
export type LayoutOptionsProps = {
  createOnActionCallback: CreateActionCallback;
  layout?: LayoutOptionsValue;
}

export const LayoutOptions = (props: LayoutOptionsProps) => {
  const {
    layout = {},
    createOnActionCallback,
  } = props
  const {
    anchorEl,
    isOpen,
    onClose,
    onOpen,
  } = useDisclosure({})
  const onSubmitCallback = React.useCallback((e) => {
    createOnActionCallback(
      EVENT.LAYOUT_CHANGED,
      {
        form: e,
        value: e.formData,
      },
    )()
    onClose()
  }, [createOnActionCallback])
  return (
    <Box>
      <Button
        onClick={onOpen}
        sx={{
          color: (theme) => theme.palette.text.secondary,
        }}
        // variant="text"
      >
        {layout.name ?? 'Select Layout'}
      </Button>
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
        PaperProps={{
          sx: {
            width: { sx: '10vw', md: '50vw' },
          },
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
