// import { Icon } from '@components/Icon'
// import {
//   IconButton, Typography,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemSecondaryAction,
//   ListItemAvatar,
//   Checkbox,
// } from '@material-ui/core'
// import {
//   EventHistory,
//   OnEventLite,
//   EventInfo,
//   Playlist,
// } from '@type'
// import {
//   View,
//   wrapComponent,
// } from 'colay-ui'
// import React from 'react'
// import * as R from 'colay/ramda'
// import Accordion from '@material-ui/core/Accordion'
// import AccordionSummary from '@material-ui/core/AccordionSummary'
// import AccordionDetails from '@material-ui/core/AccordionDetails'

// export type EventHistoryTableProps = {
//   isOpen?: boolean;
//   // onEvent: OnEventLite;
//   selectedPlaylistIds: string[]
//   playlists: Playlist[];
//   onSelectAllPlaylist: (checked: boolean) => void
//   onSelectPlaylist: (playlist: Playlist, checked: boolean) => void
//   onPlay: (playlist: Playlist) => void
// }
// export const PlaylistTable = (props: EventHistoryTableProps) => {
//   const {
//     onSelectAllPlaylist,
//     onSelectPlaylist,
//     playlists,
//     selectedPlaylistIds,
//     onPlay,
//   } = props
//   return (
//     <Accordion>
//       <AccordionSummary
//         aria-controls="panel1a-content"
//       >
//         <View
//           style={{
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             width: '100%',
//           }}
//         >
//           <View
//             style={{
//               flexDirection: 'row',
//               alignItems: 'center',
//             }}
//           >
//             <Checkbox
//               onClick={(e) => e.stopPropagation()}
//               checked={!R.isEmpty(selectedPlaylistIds)
//                && selectedPlaylistIds.length === playlists.length}
//               onChange={(_, checked) => onSelectAllPlaylist(checked)}
//               inputProps={{ 'aria-label': 'primary checkbox' }}
//             />
//             <Typography
//               variant="h6"
//             >
//               Playlists
//             </Typography>
//           </View>
//           <IconButton
//             onClick={(e) => {
//               e.stopPropagation()
//             }}
//           >
//             <Icon
//               name="delete_rounded"
//             />
//           </IconButton>
//         </View>
//       </AccordionSummary>
//       <AccordionDetails>
//         {
//           playlists.length === 0 && (
//             <Typography>
//               Let's create a playlist.
//             </Typography>
//           )
//         }
//         <List dense>
//           {
//             playlists.map((playlist, index) => {
//               const { events, id, name } = playlist
//               return (
//                 <Accordion>
//                   <AccordionSummary
//                     aria-controls="panel1a-content"
//                   >
//                     <View
//                       style={{
//                         flexDirection: 'row',
//                         justifyContent: 'space-between',
//                         alignItems: 'center',
//                         width: '100%',
//                       }}
//                     >
//                       <View
//                         style={{
//                           flexDirection: 'row',
//                           alignItems: 'center',
//                         }}
//                       >
//                         <Checkbox
//                           onClick={(e) => e.stopPropagation()}
//                           checked={!R.isEmpty(selectedPlaylistIds)
//                           && selectedPlaylistIds.length === playlists.length}
//                           onChange={(_, checked) => onSelectAllPlaylist(checked)}
//                           inputProps={{ 'aria-label': 'primary checkbox' }}
//                         />
//                         <Typography
//                           variant="h6"
//                         >
//                           {name}
//                         </Typography>
//                       </View>
//                       <View
//                         style={{
//                           flexDirection: 'row',
//                         }}
//                       >
//                         <IconButton
//                           onClick={(e) => {
//                             e.stopPropagation()
//                           }}
//                         >
//                           <Icon
//                             name="delete_rounded"
//                           />
//                         </IconButton>
//                         <IconButton
//                           edge="end"
//                           aria-label="play"
//                           onClick={(e) => {
//                             e.stopPropagation()
//                             onPlay(playlist)
//                           }}
//                         >
//                           <Icon name="play_arrow" />
//                         </IconButton>
//                       </View>
//                     </View>
//                   </AccordionSummary>
//                   <AccordionDetails>
//                     {
//                         events.map(({ type }) => (
//                           <ListItem>
//                             <ListItemAvatar>
//                               <Checkbox
//                                 // checked={selectedPlaylistIds.includes(id)}
//                                 // onChange={(_, checked) => {
//                                 //   onSelectPlaylist(playlist, checked)
//                                 // }}
//                                 inputProps={{ 'aria-label': 'primary checkbox' }}
//                                 onClick={(e) => e.stopPropagation()}
//                               />
//                             </ListItemAvatar>
//                             <ListItemText
//                               primary={type}
//                             />
//                             <ListItemSecondaryAction>
//                               <IconButton
//                                 edge="end"
//                                 aria-label="delete"
//                                 onClick={(e) => {
//                                   e.stopPropagation()
//                                 }}
//                               >
//                                 <Icon name="delete_rounded" />
//                               </IconButton>
//                             </ListItemSecondaryAction>
//                           </ListItem>
//                         ))
//                       }
//                   </AccordionDetails>
//                 </Accordion>
//               )
//             })
//           }
//         </List>
//       </AccordionDetails>
//     </Accordion>
//   )
// }
