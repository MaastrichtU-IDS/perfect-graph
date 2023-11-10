import React from 'react'
import {Box} from '@mui/material'

export type TabPanelProps = {
  children: React.ReactNode
  value: number
  index: number
}
export const TabPanel = (props: TabPanelProps) => {
  const {children, value, index, ...rest} = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...rest}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  )
}
