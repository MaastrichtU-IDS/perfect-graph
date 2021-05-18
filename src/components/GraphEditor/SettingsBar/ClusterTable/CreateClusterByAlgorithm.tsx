import React from 'react'
import {
  InputLabel, MenuItem, Select,
} from '@material-ui/core'
import Form from '@rjsf/material-ui'
import {
  View,
} from 'colay-ui'
import { useImmer } from 'colay-ui/hooks/useImmer'
import { OnEventLite } from '@type'
import { Clusters } from '@core/clusters'
import { EVENT } from '@constants'
import { useGraphEditor } from '@hooks'

export type CreateClusterByAlgorithmProps = {
  onSubmit: () => void
}
const CLUSTER_ALGORITHM_NAMES = Object.keys(Clusters)

export const CreateClusterByAlgorithm = (props: CreateClusterByAlgorithmProps) => {
  const {
    onSubmit,
  } = props
  const [
    {
      onEvent,
    },
  ] = useGraphEditor(
    (editor) => ({
      onEvent: editor.onEvent,
    }),
  )
  const [state, updateState] = useImmer({
    selectedClusterName: CLUSTER_ALGORITHM_NAMES[0],
  })
  return (
    <View
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <InputLabel id="create-cluster-by-algorithm-label">Age</InputLabel>
      <Select
        labelId="create-cluster-by-algorithm-label"
        value={state.selectedClusterName}
        onChange={(e) => updateState((draft) => {
          draft.selectedClusterName = e.target.value
        })}
      >
        {CLUSTER_ALGORITHM_NAMES.map((clusterName) => (
          <MenuItem
            key={clusterName}
            value={clusterName}
          >
            {clusterName}
          </MenuItem>
        ))}
      </Select>
      <Form
        onSubmit={(event) => {
          // updateState((draft) => {
          //   draft.formData = event.formData
          //   draft.createClusterDialog.visible = true
          // })
          // onEvent({
          //   type: EVENT.CREATE_CLUSTER_BY_ALGORITHM,
          //   payload: {
          //     config: event.formData,
          //     name: state.selectedClusterName,
          //   },
          // })
          onEvent({
            type: EVENT.CREATE_CLUSTER_BY_ALGORITHM_FORM_SUBMIT,
            payload: {
              config: event.formData,
              name: state.selectedClusterName,
            },
          })
          onSubmit()
        }}
        schema={Clusters[state.selectedClusterName].configSchema}
      />
    </View>
  )
}
