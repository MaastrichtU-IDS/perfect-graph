import * as R from 'colay/ramda'

type DoActions = any[]
type UndoActions = any[]

type HistoryItem = {
  id: string;
  do: DoActions;
  undo: UndoActions;
}
type HistoryItemOptionalId = Omit<HistoryItem, 'id'> & { id?: string; }

type HistoryRecord = {
  items: HistoryItem[]
  currentIndex: number;
}

const DEFAULT_INDEX = 0
const DEFAULT_HISTORY_DATA_ITEM: HistoryRecord = {
  items: [],
  currentIndex: DEFAULT_INDEX,
}

const EVENT_TYPE = {
  REDO: 'REDO',
  UNDO: 'UNDO',
  UNDO_ALL: 'UNDO_ALL',
  REDO_ALL: 'REDO_ALL',
} as const

// export type History = {
//   record: HistoryRecord;
//   add: (item: HistoryItem) => void;
//   clear: () => void;
//   new: () => void;
//   set: (historyRecord: HistoryRecord) => void;
//   redo: () => void;
//   redoAll: () => void;
//   undo: () => void;
//   undoAll: () => void;
//   createRoot: () => void;
//   clearRoot: () => void;
//   getRoot: () => HistoryRecord;
//   setRoot: (historyRecord: HistoryRecord) => void;
//   EVENT_TYPE: typeof EVENT_TYPE
// }
export type History = ReturnType<typeof createHistory>

type Event = {
  type: keyof typeof EVENT_TYPE;
  item: HistoryItem;
  actions: (DoActions|UndoActions);
  items?: HistoryItem[];
}

type CreateHistoryOptions = {
  onEvent: (
    event: Event
  ) => boolean|void;
}

/**
 * Create Event History recorder
 */
export const createHistory = (options: CreateHistoryOptions) => {
  const {
    onEvent = () => {},
  } = options
  const ref = {
    current: null as unknown as History,
  }
  const record: HistoryRecord = R.clone(DEFAULT_HISTORY_DATA_ITEM)

  const history = {
    record,
    add: (item: HistoryItemOptionalId) => {
      const { currentIndex, items } = record
      record.items = R.slice(
        0,
        currentIndex,
      )(items)
      record.items.push({
        id: R.uuid(),
        ...item,
      })
      record.currentIndex = record.items.length
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
      const item = record?.items?.[record.currentIndex - 1]
      if (item) {
        const passed = onEvent({
          item,
          type: EVENT_TYPE.UNDO,
          actions: item.undo,
        }) ?? true
        if (passed) {
          record.currentIndex -= 1
        }
      }
    },
    redo: () => {
      const { currentIndex } = record
      const item = record?.items?.[currentIndex]
      if (item) {
        const passed = onEvent({
          item,
          type: EVENT_TYPE.REDO,
          actions: item.do,
        }) ?? true
        if (passed) {
          record.currentIndex = currentIndex + 1
        }
      }
    },
    undoAll: () => R.when(
      R.allPass([
        R.isNotNil,
        () => record.items.length > record.currentIndex,
      ]),
      () => {
        const {
          items,
        } = record
        const relatedItems = R.slice(0, record.currentIndex + 1)(items)
        const undoList = R.unnest(
          R.map(
            (item) => item.undo,
            relatedItems,
          ),
        ) as UndoActions[]
        const doList = R.unnest(
          R.map(
            (item) => item.do,
            relatedItems,
          ),
        ) as DoActions[]
        onEvent({
          item: {
            id: R.uuid,
            do: doList,
            undo: undoList,
          },
          actions: undoList,
          items: relatedItems,
          type: EVENT_TYPE.UNDO_ALL,
        })
        record.currentIndex = DEFAULT_INDEX
      },
    )(record),
    redoAll: () => R.when(
      R.allPass([
        R.isNotNil,
        () => record.items.length > record.currentIndex,
      ]),
      () => {
        const {
          items,
        } = record
        const relatedItems = R.slice(0, record.currentIndex + 1)(items)
        const undoList = R.unnest(
          R.map(
            (item) => item.undo,
            relatedItems,
          ),
        ) as UndoActions[]
        const doList = R.unnest(
          R.map(
            (item) => item.do,
            relatedItems,
          ),
        ) as DoActions[]
        onEvent({
          item: {
            id: R.uuid,
            do: doList,
            undo: undoList,
          },
          actions: doList,
          items: relatedItems,
          type: EVENT_TYPE.REDO_ALL,
        })
        record.currentIndex = DEFAULT_INDEX
      },
    )(record),
    delete: (ids: string[]) => {
      record.items = record.items.filter((item, index) => {
        const deleted = ids.includes(item.id)
        if (deleted && index < record.currentIndex) {
          record.currentIndex -= 1
        }
        return !deleted
      })
    },
    getEventIdsByDoItemIds: (ids: string[]) => {
      const events = record.items.filter((item) => {
        const doItems = item.do.map((doItem) => doItem.id)
        const intersection = R.intersection(doItems, ids)
        return intersection.length > 0
      })
      return events.map((event) => event.id)
    },
    reorder: (fromIndex: number, toIndex: number) => {
      record.items = R.reorder(fromIndex, toIndex)(record.items)
    },
  }
  ref.current = history
  return history
}
