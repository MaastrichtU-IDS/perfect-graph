import React from 'react'
import {
  AddCircle,
  Adjust,
  DeleteRounded,
  RecordVoiceOverRounded,
  Edit,
  ExpandMore,
  BuildCircle,
  RepeatOne,
  SortByAlpha,
  Close,
  InfoOutlined,
  Filter,
  ArrowDropDownRounded,
  ArrowDropUpRounded,
  Bookmark,
  Bookmarks,
  BookmarkBorder,
  Minimize,
  Videocam,
  FiberManualRecord,
  Settings,
  BuildCircleOutlined,
  MoreVert,
  Redo,
  ChevronLeft,
  ChevronRight,
  KeyboardArrowUp,
  KeyboardArrowDown,
  PlaylistAdd,
  PlaylistPlay,
  PlayArrow,
  NavigateNext,
  NavigateBefore,
  Assessment,
  Beenhere,
  UnfoldLess,
  UnfoldMore,
  MyLocation,
} from '@material-ui/icons'
import { IconProps } from '@material-ui/core'

const ICONS = {
  assessment: Assessment,
  add_circle: AddCircle,
  addjust: Adjust,
  delete_rounded: DeleteRounded,
  record_voice_over_rounded: RecordVoiceOverRounded,
  build_circle_outlined: BuildCircleOutlined,
  more_vert: MoreVert,
  edit: Edit,
  build_circle: BuildCircle,
  repeat_one: RepeatOne,
  sort_by_alpha: SortByAlpha,
  close: Close,
  info_outlined: InfoOutlined,
  filter: Filter,
  arrow_drop_down_rounded: ArrowDropDownRounded,
  arrow_drop_up_rounded: ArrowDropUpRounded,
  bookmarks: Bookmarks,
  bookmark: Bookmark,
  bookmark_border: BookmarkBorder,
  minimize: Minimize,
  videocam: Videocam,
  fiber_manual_record: FiberManualRecord,
  settings: Settings,
  redo: Redo,
  chevron_left: ChevronLeft,
  chevron_right: ChevronRight,
  keyboard_arrow_up: KeyboardArrowUp,
  keyboard_arrow_down: KeyboardArrowDown,
  playlist_add: PlaylistAdd,
  playlist_play: PlaylistPlay,
  expand_more: ExpandMore,
  play_arrow: PlayArrow,
  navigate_before: NavigateBefore,
  navigate_next: NavigateNext,
  beenhere: Beenhere,
  unfold_less: UnfoldLess,
  unfold_more: UnfoldMore,
  my_location: MyLocation,
} as const

type IconName = keyof typeof ICONS

export const Icon = (props: IconProps & { name: IconName;}) => {
  const {
    name,
    ...rest
  } = props
  const IconSelected = ICONS[name]
  return (
    <IconSelected {...rest} />
  )
}
