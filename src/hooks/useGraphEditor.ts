// import { createStoreProvider } from 'colay-ui'
import { createStoreProvider } from '@root/components/GraphEditor/createStoreProviderWithoutImmer'
import {
  OnEventLite,
  GraphConfig,
  GraphEditorConfig,
  GraphLabelData,
  EditorMode,
  RecordedEvent,
  EventHistory,
  Playlist,
  NodeElement,
  GraphEditorProps,
} from '@type'

export type GraphEditor = {
  onEvent: OnEventLite;
  graphConfig?: GraphConfig;
  config?: GraphEditorConfig;
  label?: GraphLabelData;
  selectedElementIds?: string[] | null;
  mode?: EditorMode;
  events?: RecordedEvent[]
  eventHistory?: EventHistory;
  playlists?: Playlist[];
  localDataRef: {
    initialized: false;
    targetNode: NodeElement | null;
    props: GraphEditorProps;
    issuedClusterId: string|null;
    newClusterBoxSelection: {
      elementIds: string[];
    };
  };
  localNetworkStatistics?: any;
}

const {
  // store,
  Context,
  useSelector,
  Provider,
} = createStoreProvider<GraphEditor>({} as unknown as GraphEditor)

export const GraphEditorContext = Context
export const GraphEditorProvider = Provider
export const useGraphEditor = useSelector
