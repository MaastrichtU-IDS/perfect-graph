import React from 'react'
import {
  AddCircle,
  Adjust,
  DeleteRounded,
  RecordVoiceOverRounded,
  Edit,
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
} from '@material-ui/icons'
import { IconProps } from '@material-ui/core'

const ICONS = {
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
