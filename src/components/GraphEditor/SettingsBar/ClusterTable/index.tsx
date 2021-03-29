import { TabPanel } from '@components/TabPanel'
import {
  Button,
  Card, Checkbox,
  Dialog, DialogTitle, IconButton, List,
  ListItem, ListItemAvatar, ListItemSecondaryAction,
  ListItemText, TextField, Typography,
  Menu,
  MenuItem,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
} from '@material-ui/core'
import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import { FormProps } from '@rjsf/core'
import Form from '@rjsf/material-ui'
import {
  Cluster, EditorMode, OnEventLite,
} from '@type'
import { EDITOR_MODE, EVENT } from '@utils/constants'
import {
  View,
  useDisclosure,
} from 'colay-ui'
import { useImmer } from 'colay-ui/hooks/useImmer'
import * as R from 'colay/ramda'
import React from 'react'
import { SortableList } from '@components/SortableList'
import { Icon } from '../../../Icon'
import { CreateClusterByAlgorithm } from './CreateClusterByAlgorithm'

export type ClusterTableProps = {
  opened?: boolean;
  onEvent: OnEventLite;
  selectedClusterIds: string[]
  clusters: Cluster[];
  // onSelectAllClusters: (checked: boolean) => void
  // onSelectCluster: (cluster: Cluster, checked: boolean) => void
  createClusterForm: FormProps<any>;
  editorMode: EditorMode;
  graphEditorLocalDataRef: any;
}
export const ClusterTable = (props: ClusterTableProps) => {
  const {
    // onSelectAllClusters,
    // onSelectCluster,
    onEvent,
    clusters,
    createClusterForm,
    editorMode,
    graphEditorLocalDataRef,
  } = props
  const [state, updateState] = useImmer({
    expanded: false,
    selectedClusterIds: [] as string[],
    currentTab: 0,
    formData: {},
    createClusterDialog: {
      name: '',
      visible: false,
    },
  })
  const hasSelected = state.selectedClusterIds.length > 0
  const {
    anchorEl,
    isOpen,
    onClose,
    onOpen,
  } = useDisclosure({})
  return (
    <>
      <Accordion
        expanded={state.expanded}
        onChange={(e, expanded) => updateState((draft) => {
          draft.expanded = expanded
        })}
      >
        <AccordionSummary
          aria-controls="panel1a-content"
        >
          <View
            style={{
              width: '100%',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Typography
                  variant="h6"
                >
                  Clusters
                </Typography>
              </View>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation()
                  // updateState((draft) => {
                  //   draft.currentTab = (state.currentTab + 1) % 2
                  // })
                  onOpen(e)
                }}
              >
                <Icon
                  color={state.currentTab === 0 ? 'inherit' : 'secondary'}
                  name={state.currentTab === 0 ? 'add_circle' : 'close'}
                />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={isOpen}
                onClose={onClose}
                // style={{ width: 400 }}
              >
                {
                  state.currentTab !== 0 && (
                    <MenuItem
                      // key="Close"
                    // selected={index === selectedIndex}
                      onClick={(event) => {
                        event.stopPropagation()
                        updateState((draft) => {
                          draft.currentTab = 0
                        })
                        onClose()
                      }}
                    >
                      Close
                    </MenuItem>
                  )
                }
                <MenuItem
                  // key="By Filter"
                  selected={state.currentTab === 1}
                  onClick={(event) => {
                    event.stopPropagation()
                    updateState((draft) => {
                      draft.currentTab = 1
                      draft.expanded = true
                    })
                    onClose()
                  }}
                >
                  By Filter
                </MenuItem>
                <MenuItem
                  // key="By Algorithm"
                  selected={state.currentTab === 2}
                  onClick={(event) => {
                    event.stopPropagation()
                    updateState((draft) => {
                      draft.currentTab = 2
                      draft.expanded = true
                    })
                    onClose()
                  }}
                >
                  By Algorithm
                </MenuItem>
              </Menu>
            </View>
            {
            state.expanded && hasSelected && (
              <Card
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  height: 32,
                  width: '100%',
                }}
              >
                <ListItem>
                  <Checkbox
                    onClick={(e) => e.stopPropagation()}
                    checked={!R.isEmpty(state.selectedClusterIds)
               && state.selectedClusterIds.length === clusters.length}
                    onChange={(_, checked) => {
                      updateState((draft) => {
                        if (checked) {
                          draft.selectedClusterIds = clusters.map((cluster) => cluster.id)
                        } else {
                          draft.selectedClusterIds = []
                        }
                      })
                    }}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                  >
                    <Icon
                      name="delete_rounded"
                    />
                  </IconButton>
                </ListItem>
              </Card>
            )
          }
          </View>

        </AccordionSummary>
        <AccordionDetails>
          <TabPanel
            value={state.currentTab}
            index={0}
            style={{
              padding: 0,
              paddingLeft: 0,
              paddingTop: 0,
              paddingRight: 0,
              paddingBottom: 0,
            }}
          >
            {
          clusters.length === 0 && (
            <Typography>
              Let's create a Cluster.
            </Typography>
          )
        }
            <List dense>
              <SortableList
                onDragEnd={(result) => {
                  if (!result.destination && (result.destination.index === result.source.index)) {
                    return
                  }
                  onEvent({
                    type: EVENT.CLUSTER_REORDER,
                    payload: {
                      fromIndex: result.source.index,
                      toIndex: result.destination.index,
                    },
                  })
                }}
                data={clusters}
                renderItem={({
                  provided,
                  item: cluster,
                  index,
                }) => {
                  const { ids: elementIds, id, name } = cluster
                  return (
                    <Accordion
                      key={id}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <AccordionSummary
                        aria-controls="panel1a-content"
                      >
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                          }}
                        >
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}
                          >
                            <Checkbox
                              onClick={(e) => e.stopPropagation()}
                              checked={!R.isEmpty(state.selectedClusterIds)
                          && state.selectedClusterIds.length === clusters.length}
                              onChange={(_, checked) => {
                                updateState((draft) => {
                                  if (checked) {
                                    draft.selectedClusterIds.push(cluster.id)
                                  } else {
                                    draft.selectedClusterIds = draft.selectedClusterIds.filter(
                                      (id) => id !== cluster.id,
                                    )
                                  }
                                })
                              }}
                              inputProps={{ 'aria-label': 'primary checkbox' }}
                            />
                            <Typography
                              variant="h6"
                            >
                              {name}
                            </Typography>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                            }}
                          >
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation()
                                onEvent({
                                  type: EVENT.PRESS_ADD_CLUSTER_ELEMENT,
                                  payload: {
                                    clusterId: cluster.id,
                                  },
                                })
                              }}
                            >
                              <Icon
                                color={
                              editorMode === EDITOR_MODE.ADD_CLUSTER_ELEMENT
                                && graphEditorLocalDataRef.current.issuedClusterId === cluster.id
                                ? 'primary' : 'inherit'
                            }
                                name="add_circle"
                              />
                            </IconButton>
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation()
                                onEvent({
                                  type: EVENT.DELETE_CLUSTER,
                                  payload: {
                                    clusterId: cluster.id,
                                  },
                                })
                              }}
                            >
                              <Icon
                                name="delete_rounded"
                              />
                            </IconButton>
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation()
                                onEvent({
                                  type: EVENT.CHANGE_CLUSTER_VISIBILITY,
                                  payload: {
                                    clusterId: cluster.id,
                                    value: cluster.visible === false,
                                  },
                                })
                              }}
                            >
                              <Icon
                                name={cluster.visible === false ? 'unfold_more' : 'unfold_less'}
                              />
                            </IconButton>
                            <IconButton
                              edge="end"
                              aria-label="beenhere"
                              onClick={(e) => {
                                e.stopPropagation()
                                onEvent({
                                  type: EVENT.SELECT_CLUSTER,
                                  payload: {
                                    clusterId: cluster.id,
                                  },
                                })
                                // onPlay(cluster)
                              }}
                            >
                              <Icon name="beenhere" />
                            </IconButton>
                            <IconButton
                              edge="end"
                              disableFocusRipple
                              disableRipple
                              disableTouchRipple
                              {...provided.dragHandleProps}
                            >
                              <Icon name="drag_handle" />
                            </IconButton>
                          </View>
                        </View>
                      </AccordionSummary>
                      <AccordionDetails>
                        {
                        elementIds.map((elementId) => (
                          <ListItem
                            key={elementId}
                          >
                            <ListItemAvatar>
                              <Checkbox
                                // checked={selectedClustersIds.includes(id)}
                                // onChange={(_, checked) => {
                                //   onSelectCluster(cluster, checked)
                                // }}
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </ListItemAvatar>
                            <ListItemText
                              primary={R.take(10)(elementId)}
                            />
                            <ListItemSecondaryAction>
                              <IconButton
                                edge="end"
                                aria-label="select"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onEvent({
                                    type: EVENT.ELEMENT_SELECTED,
                                    elementId,
                                  })
                                }}
                              >
                                <Icon name="my_location" />
                              </IconButton>
                              <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onEvent({
                                    type: EVENT.DELETE_CLUSTER_ELEMENT,
                                    payload: {
                                      elementId,
                                      clusterId: cluster.id,
                                    },
                                  })
                                }}
                              >
                                <Icon name="delete_rounded" />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))
                      }
                      </AccordionDetails>
                    </Accordion>
                  )
                }}
              />
            </List>
          </TabPanel>
          <TabPanel
            value={state.currentTab}
            index={1}
          >
            <Form
              onSubmit={(event) => {
                updateState((draft) => {
                  draft.formData = event.formData
                  draft.createClusterDialog.visible = true
                })
              }}
              {...createClusterForm}
            />
          </TabPanel>
          <TabPanel
            value={state.currentTab}
            index={2}
          >
            <CreateClusterByAlgorithm
              onEvent={onEvent}
              onSubmit={() => {
                updateState((draft) => {
                  draft.currentTab = 0
                })
              }}
            />
          </TabPanel>
        </AccordionDetails>
      </Accordion>
      <Dialog
        onClose={() => updateState((draft) => {
          draft.createClusterDialog.visible = false
        })}
        aria-labelledby="create-playlist-dialog-title"
        open={state.createClusterDialog.visible}
      >
        <DialogTitle id="create-playlist-dialog-title">Create Cluster</DialogTitle>
        <View
          style={{
            width: '50%',
            padding: 10,
            justifyContent: 'center',
          }}
        >
          <TextField
            style={{
              marginBottom: 10,
              width: '50vw',
            }}
            fullWidth
            label="name"
            value={state.createClusterDialog.name}
            onChange={({ target: { value } }) => updateState((draft) => {
              draft.createClusterDialog.name = value
            })}
          />
          <Button
            fullWidth
            onClick={() => {
              updateState((draft) => {
                draft.currentTab = 0
                draft.createClusterDialog.name = ''
                draft.createClusterDialog.visible = false
              })
              onEvent({
                type: EVENT.CREATE_CLUSTER_FORM_SUBMIT,
                payload: {
                  formData: state.formData,
                  name: state.createClusterDialog.name,
                },
              })
            }}
          >
            Create
          </Button>
        </View>
      </Dialog>
    </>
  )
}

/* <View
                            style={{
                              width: 24,
                              height: 24
                            }}
                          >
                          <SpeedDial
                            ariaLabel="SpeedDial basic example"
                            icon={<SpeedDialIcon />}
                            style={{ position: 'absolute', left: 0, top: 0}}
                            direction="left"
                          >
                            <SpeedDialAction
                              icon={
                                <IconButton
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onEvent({
                                    type: EVENT.PRESS_ADD_CLUSTER_ELEMENT,
                                    payload: {
                                      clusterId: cluster.id,
                                    },
                                  })
                                }}
                              >
                                <Icon
                                  color={
                              editorMode === EDITOR_MODE.ADD_CLUSTER_ELEMENT
                                && graphEditorLocalDataRef.current.issuedClusterId === cluster.id
                                ? 'primary' : 'inherit'
                            }
                                  name="add_circle"
                                />
                              </IconButton>
                              }
                            />
                            <SpeedDialAction
                            icon={
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onEvent({
                                    type: EVENT.DELETE_CLUSTER,
                                    payload: {
                                      clusterId: cluster.id,
                                    },
                                  })
                                }}
                              >
                                <Icon
                                  name="delete_rounded"
                                />
                              </IconButton>
                            }
                            />

                            <SpeedDialAction
                              icon={
                                <IconButton
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onEvent({
                                    type: EVENT.CHANGE_CLUSTER_VISIBILITY,
                                    payload: {
                                      clusterId: cluster.id,
                                      value: cluster.visible === false,
                                    },
                                  })
                                }}
                              >
                                <Icon
                                  name={cluster.visible === false ? 'unfold_more' : 'unfold_less'}
                                />
                              </IconButton>
                              }
                            />

                            <SpeedDialAction
                            icon={
                              <IconButton
                                edge="end"
                                aria-label="beenhere"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onEvent({
                                    type: EVENT.SELECT_CLUSTER,
                                    payload: {
                                      clusterId: cluster.id,
                                    },
                                  })
                                // onPlay(cluster)
                                }}
                              >
                                <Icon name="beenhere" />
                              </IconButton>
                            }
                           />
                            <SpeedDialAction
                              icon={(
                                <IconButton
                                  edge="end"
                                  disableFocusRipple
                                  disableRipple
                                  disableTouchRipple
                                  {...provided.dragHandleProps}
                                >
                                  <Icon name="drag_handle" />
                                </IconButton>
)}
                            />
                          </SpeedDial>
                          </View> */
