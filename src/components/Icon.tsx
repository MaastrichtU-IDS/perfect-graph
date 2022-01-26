import React from 'react'
import {
  AddCircle,
  Adjust,
  ArticleOutlined,
  AppRegistrationOutlined,
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
  TocOutlined,
  SettingsOutlined,
  Beenhere,
  UnfoldLess,
  UnfoldMore,
  MyLocation,
  DragHandle,
  CancelRounded,
  CenterFocusStrong,
  TuneOutlined,
} from '@mui/icons-material'
import { IconProps as MUIIconProps } from '@mui/material'

const ICONS = {
  app_registration_outlined: AppRegistrationOutlined,
  assessment: Assessment,
  add_circle: AddCircle,
  addjust: Adjust,
  cancel_rounded: CancelRounded,
  delete_rounded: DeleteRounded,
  record_voice_over_rounded: RecordVoiceOverRounded,
  build_circle_outlined: BuildCircleOutlined,
  more_vert: MoreVert,
  edit: Edit,
  center_focus_strong: CenterFocusStrong,
  build_circle: BuildCircle,
  repeat_one: RepeatOne,
  sort_by_alpha: SortByAlpha,
  close: Close,
  info_outlined: InfoOutlined,
  filter: Filter,
  arrow_drop_down_rounded: ArrowDropDownRounded,
  arrow_drop_up_rounded: ArrowDropUpRounded,
  article_outlined: ArticleOutlined,
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
  drag_handle: DragHandle,
  toc_outlined: TocOutlined,
  tune_outlined: TuneOutlined,
  settings_outlined: SettingsOutlined,
} as const

type IconName = keyof typeof ICONS

export type IconProps = Omit<MUIIconProps, 'name'> & {
  name: IconName;
}

export const Icon = (props: IconProps) => {
  const {
    name,
    ...rest
  } = props
  const IconSelected = ICONS[name]
  return (
    // @ts-ignore
    <IconSelected {...rest} />
  )
}
