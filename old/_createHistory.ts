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
  data: Record<string, HistoryRecord>;
  add: (name: string, item: HistoryItem) => void;
  clear: (name: string) => void;
  new: (name: string) => void;
  get: (name: string) => HistoryRecord;
  set: (name: string, historyDataItem: HistoryRecord) => void;
  redo: (name: string) => void;
  redoAll: (name: string) => void;
  undo: (name: string) => void;
  undoAll: (name: string) => void;
  createRoot: () => void;
  clearRoot: () => void;
  getRoot: () => HistoryRecord;
  setRoot: (historyDataItem: HistoryRecord) => void;
  ACTION_TYPE: typeof ACTION_TYPE
}

type Action = {
  type: keyof typeof ACTION_TYPE,
  actions: (DoActions|UndoActions),
  name: string,
}

type CreateHistoryOptions = {
  onAction: (
    action: Action
  ) => boolean|void;
  createRoot?: boolean;
}

export const createHistory = (options: CreateHistoryOptions) => {
  const {
    onAction = () => {},
    createRoot = true,
  } = options
  const ROOT_NAME = 'ROOT'
  const ref = {
    current: null as unknown as History,
  }
  ref.current = {
    data: {} as Record<string, HistoryRecord>,
    add: (name: string, item: HistoryItem) => {
      const {
        current: history,
      } = ref
      if (!history.get(name)) {
        history.new(name)
      }
      const historyDataItem = history.get(name)
      const currentIndex = historyDataItem.index
      historyDataItem.doActionsList = R.slice(
        0,
        currentIndex,
      )(historyDataItem.doActionsList)
      historyDataItem.undoActionsList = R.slice(
        0,
        currentIndex,
      )(historyDataItem.undoActionsList)
      historyDataItem.doActionsList.push(item.doActions)
      historyDataItem.undoActionsList.push(item.undoActions)
      historyDataItem.index = historyDataItem.doActionsList.length
    },
    new: (name: string) => {
      const {
        current: history,
      } = ref
      history.set(
        name,
        R.clone(DEFAULT_HISTORY_DATA_ITEM),
      )
    },
    clear: (name: string = ROOT_NAME) => {
      const {
        current: history,
      } = ref
      history.set(
        name,
        R.clone(DEFAULT_HISTORY_DATA_ITEM),
      )
    },
    get: (name: string) => {
      const {
        current: history,
      } = ref
      return history.data[name]
    },
    set: (name: string, historyDataItem: HistoryRecord) => {
      const {
        current: history,
      } = ref
      history.data[name] = historyDataItem
    },
    undo: (name: string = ROOT_NAME) => {
      const {
        current: history,
      } = ref
      const historyDataItem = history.get(name)
      const currentIndex = historyDataItem.index - 1
      const actions = historyDataItem?.undoActionsList?.[currentIndex]
      if (actions) {
        const undone = onAction({
          name,
          actions,
          type: ACTION_TYPE.UNDO,
        }) ?? true
        if (undone) {
          historyDataItem.index = currentIndex
        }
      }
    },
    redo: (name: string = ROOT_NAME) => {
      const {
        current: history,
      } = ref
      const historyDataItem = history.get(name)
      const currentIndex = historyDataItem.index
      const actions = historyDataItem?.doActionsList?.[currentIndex]
      if (actions) {
        const done = onAction({
          name,
          actions,
          type: ACTION_TYPE.REDO,
        }) ?? true
        if (done) {
          historyDataItem.index = currentIndex + 1
        }
      }
    },
    undoAll: (name: string = ROOT_NAME) => {
      const {
        current: history,
      } = ref
      const historyDataItem = history.get(name)
      return R.when(
        R.allPass([
          R.isNotNil,
          () => historyDataItem.undoActionsList.length > historyDataItem.index,
        ]),
        () => {
          const {
            undoActionsList,
          } = historyDataItem
          const actions = R.unnest(
            R.slice(0, historyDataItem.index + 1)(undoActionsList),
          ) as UndoActions[]
          onAction({
            actions,
            name,
            type: ACTION_TYPE.UNDO,
          })
          historyDataItem.index = DEFAULT_INDEX
        },
      )(historyDataItem)
    },
    redoAll: (name: string = ROOT_NAME) => {
      const {
        current: history,
      } = ref
      const historyDataItem = history.get(name)
      return R.when(
        R.allPass([
          R.isNotNil,
          () => historyDataItem.doActionsList.length > historyDataItem.index,
        ]),
        () => {
          const {
            doActionsList,
          } = historyDataItem
          const actions = R.unnest(
            R.slice(0, historyDataItem.index + 1)(doActionsList),
          ) as DoActions[]
          onAction({
            actions,
            name,
            type: ACTION_TYPE.REDO,
          })
          historyDataItem.index = DEFAULT_INDEX
        },
      )(historyDataItem)
    },
    createRoot: () => {
      const {
        current: history,
      } = ref
      history.new(ROOT_NAME)
    },
    getRoot: () => {
      const {
        current: history,
      } = ref
      return history.get(ROOT_NAME)
    },
    setRoot: (historyDataItem) => {
      const {
        current: history,
      } = ref
      history.set(ROOT_NAME, historyDataItem)
    },
  }

  if (createRoot) {
    ref.current.createRoot()
  }
  return ref.current
}
