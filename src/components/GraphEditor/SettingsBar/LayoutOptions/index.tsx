import { Collapsible, CollapsibleContainer, CollapsibleTitle } from '@components/Collapsible'
import { EVENT } from '@constants'
import { Form } from '@components/Form'
import { OnEventLite } from '@type'
import * as R from 'colay/ramda'
import React from 'react'
import {
  getFormProps,
} from './getFormProps'

type LayoutOptionsValue = {
  name?: string;
  animationDuration?: number;
  refresh? : number;
  maxIterations? : number;
  maxSimulationTime? : number;
}
export type LayoutOptionsProps = {
  layout?: LayoutOptionsValue;
  schema?: any;
  onEvent: OnEventLite;
}

export const LayoutOptions = (props: LayoutOptionsProps) => {
  const {
    layout = {},
    onEvent,
    schema,
  } = props
  // const {
  //   anchorEl,
  //   isOpen,
  //   onClose,
  //   onOpen,
  // } = useDisclosure({})
  const onSubmitCallback = React.useCallback((e) => {
    onEvent({
      type: EVENT.LAYOUT_CHANGED,
      payload: {
        form: e,
        value: e.formData,
      },
    })
    // onClose()
  }, [onEvent])
  return (
    <Collapsible>
        {
          ({ isOpen, onToggle }) => (
            <>
            <CollapsibleTitle
              onClick={onToggle}
            >
              Layout
            </CollapsibleTitle>
            {
              isOpen && (
                <CollapsibleContainer>
                  <Form
                    {...getFormProps()}
                    {...(schema ? { schema: R.omit(['title'], schema) } : {})}
                    // extraData={[layout]}
                    formData={{
                      name: layout.name,
                      animationDuration: layout.animationDuration,
                      refresh: layout.refresh,
                      maxIterations: layout.maxIterations,
                      maxSimulationTime: layout.maxSimulationTime,
                    }}
                    onSubmit={onSubmitCallback}
                  />
                </CollapsibleContainer>
              )
            }
            </>
          )
}
</Collapsible>
    
  // <Box>
  //   <Button
  //     // @ts-ignore
  //     onClick={onOpen}
  //     sx={{
  //       color: (theme) => theme.palette.text.secondary,
  //     }}
  //   >
  //     {layout.name ?? 'Select Layout'}
  //   </Button>
  //   {/* <Popover
  //     open={isOpen}
  //     anchorEl={anchorEl}
  //     PaperProps={{
  //       style: {
  //         width: '100%',
  //         height: '100%',
  //         top: 0,
  //         left: 0,
  //         position: 'absolute',
  //         backgroundColor: 'rgba(0,0,0,0.4)',
  //         zIndex: 100,
  //       },
  //     }}
  //   /> */}
  //   <Popover
  //     // id={id}
  //     open={isOpen}
  //     anchorEl={anchorEl}
  //     onClose={onClose}
  //     anchorOrigin={{
  //       vertical: 'bottom',
  //       horizontal: 'center',
  //     }}
  //     transformOrigin={{
  //       vertical: 'top',
  //       horizontal: 'center',
  //     }}
  //   >
  //     <Portal>
  //       <Backdrop
  //         open
  //         sx={{
  //           position: 'absolute',
  //           top: 0,
  //           left: 0,
  //           zIndex: (theme) => theme.zIndex.drawer,
  //           width: '100vw',
  //           height: '100vw',
  //         }}
  //       />
  //     </Portal>
  //     <Box
  //       sx={{
  //         width: WIDTH,
  //         padding: 2,
  //       }}
  //     >
  //       <Form
  //         {...getFormProps()}
  //         {...(schema ? { schema } : {})}
  //         // extraData={[layout]}
  //         formData={{
  //           name: layout.name,
  //           animationDuration: layout.animationDuration,
  //           refresh: layout.refresh,
  //           maxIterations: layout.maxIterations,
  //           maxSimulationTime: layout.maxSimulationTime,
  //         }}
  //         onSubmit={onSubmitCallback}
  //       />
  //     </Box>
  //   </Popover>

  // </Box>
  )
}
