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
  index: number;
}

const DEFAULT_INDEX = 0
const DEFAULT_HISTORY_DATA_ITEM: HistoryRecord = {
  doActionsList: [],
  undoActionsList: [],
  index: DEFAULT_INDEX,
}

const ACTION_TYPE = {
  REDO: 'REDO',
  UNDO: 'UNDO',
} as const

export type History = {
  historyRecord: HistoryRecord;
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
  const historyRecord: HistoryRecord = R.clone(DEFAULT_HISTORY_DATA_ITEM)
  ref.current = {
    historyRecord,
    add: (item: HistoryItem) => {
      const currentIndex = historyRecord.index
      historyRecord.doActionsList = R.slice(
        0,
        currentIndex,
      )(historyRecord.doActionsList)
      historyRecord.undoActionsList = R.slice(
        0,
        currentIndex,
      )(historyRecord.undoActionsList)
      historyRecord.doActionsList.push(item.doActions)
      historyRecord.undoActionsList.push(item.undoActions)
      historyRecord.index = historyRecord.doActionsList.length
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
        historyRecord[key] = newHistoryRecord[key]
      })
    },
    undo: () => {
      const currentIndex = historyRecord.index - 1
      const actions = historyRecord?.undoActionsList?.[currentIndex]
      console.log('undo', actions, historyRecord)
      if (actions) {
        const undone = onAction({
          actions,
          type: ACTION_TYPE.UNDO,
        }) ?? true
        if (undone) {
          historyRecord.index = currentIndex
        }
      }
    },
    redo: () => {
      const currentIndex = historyRecord.index
      const actions = historyRecord?.doActionsList?.[currentIndex]
      if (actions) {
        const done = onAction({
          actions,
          type: ACTION_TYPE.REDO,
        }) ?? true
        if (done) {
          historyRecord.index = currentIndex + 1
        }
      }
    },
    undoAll: () => R.when(
      R.allPass([
        R.isNotNil,
        () => historyRecord.undoActionsList.length > historyRecord.index,
      ]),
      () => {
        const {
          undoActionsList,
        } = historyRecord
        const actions = R.unnest(
          R.slice(0, historyRecord.index + 1)(undoActionsList),
        ) as UndoActions[]
        onAction({
          actions,
          type: ACTION_TYPE.UNDO,
        })
        historyRecord.index = DEFAULT_INDEX
      },
    )(historyRecord),
    redoAll: () => R.when(
      R.allPass([
        R.isNotNil,
        () => historyRecord.doActionsList.length > historyRecord.index,
      ]),
      () => {
        const {
          doActionsList,
        } = historyRecord
        const actions = R.unnest(
          R.slice(0, historyRecord.index + 1)(doActionsList),
        ) as DoActions[]
        onAction({
          actions,
          type: ACTION_TYPE.REDO,
        })
        historyRecord.index = DEFAULT_INDEX
      },
    )(historyRecord),
  }
  return ref.current
}
