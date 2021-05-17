import * as R from 'colay/ramda'

type DoActions = any[]
type UndoActions = any[]

type HistoryItem = {
  doActions: DoActions;
  undoActions: UndoActions;
}

type HistoryRecord = {
  doActionsList: DoActions[];
  undoActionsList: UndoActions[];
  currentIndex: number;
}

const DEFAULT_INDEX = 0
const DEFAULT_HISTORY_DATA_ITEM: HistoryRecord = {
  doActionsList: [],
  undoActionsList: [],
  currentIndex: DEFAULT_INDEX,
}

const ACTION_TYPE = {
  REDO: 'REDO',
  UNDO: 'UNDO',
} as const

export type History = {
  record: HistoryRecord;
  add: (item: HistoryItem) => void;
  clear: () => void;
  new: () => void;
  set: (historyRecord: HistoryRecord) => void;
  redo: () => void;
  redoAll: () => void;
  undo: () => void;
  undoAll: () => void;
  createRoot: () => void;
  clearRoot: () => void;
  getRoot: () => HistoryRecord;
  setRoot: (historyRecord: HistoryRecord) => void;
  ACTION_TYPE: typeof ACTION_TYPE
}

type Action = {
  type: keyof typeof ACTION_TYPE,
  actions: (DoActions|UndoActions),
}

type CreateHistoryOptions = {
  onAction: (
    action: Action
  ) => boolean|void;
}

export const createHistory = (options: CreateHistoryOptions) => {
  const {
    onAction = () => {},
  } = options
  const ref = {
    current: null as unknown as History,
  }
  const record: HistoryRecord = R.clone(DEFAULT_HISTORY_DATA_ITEM)
  ref.current = {
    record,
    add: (item: HistoryItem) => {
      const currentIndex = record.currentIndex
      record.doActionsList = R.slice(
        0,
        currentIndex,
      )(record.doActionsList)
      record.undoActionsList = R.slice(
        0,
        currentIndex,
      )(record.undoActionsList)
      record.doActionsList.push(item.doActions)
      record.undoActionsList.push(item.undoActions)
      record.currentIndex = record.doActionsList.length
    },
    clear: () => {
      const {
        current: history,
      } = ref
      history.set(R.clone(DEFAULT_HISTORY_DATA_ITEM))
    },
    set: (newHistoryRecord: HistoryRecord) => {
      Object.keys(newHistoryRecord).forEach((key) => {
        // @ts-ignore
        record[key] = newHistoryRecord[key]
      })
    },
    undo: () => {
      const currentIndex = record.currentIndex - 1
      const actions = record?.undoActionsList?.[currentIndex]
      if (actions) {
        const undone = onAction({
          actions,
          type: ACTION_TYPE.UNDO,
        }) ?? true
        if (undone) {
          record.currentIndex = currentIndex
        }
      }
    },
    redo: () => {
      const currentIndex = record.currentIndex
      const actions = record?.doActionsList?.[currentIndex]
      if (actions) {
        const done = onAction({
          actions,
          type: ACTION_TYPE.REDO,
        }) ?? true
        if (done) {
          record.currentIndex = currentIndex + 1
        }
      }
    },
    undoAll: () => R.when(
      R.allPass([
        R.isNotNil,
        () => record.undoActionsList.length > record.currentIndex,
      ]),
      () => {
        const {
          undoActionsList,
        } = record
        const actions = R.unnest(
          R.slice(0, record.currentIndex + 1)(undoActionsList),
        ) as UndoActions[]
        onAction({
          actions,
          type: ACTION_TYPE.UNDO,
        })
        record.currentIndex = DEFAULT_INDEX
      },
    )(record),
    redoAll: () => R.when(
      R.allPass([
        R.isNotNil,
        () => record.doActionsList.length > record.currentIndex,
      ]),
      () => {
        const {
          doActionsList,
        } = record
        const actions = R.unnest(
          R.slice(0, record.currentIndex + 1)(doActionsList),
        ) as DoActions[]
        onAction({
          actions,
          type: ACTION_TYPE.REDO,
        })
        record.currentIndex = DEFAULT_INDEX
      },
    )(record),
  }
  return ref.current
}
