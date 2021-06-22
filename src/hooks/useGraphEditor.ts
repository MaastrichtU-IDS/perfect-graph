import { createStoreProvider } from 'colay-ui'
import {
  NetworkStatistics,
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
  ElementData,
  Element,
  GraphEditorRef,
} from '@type'

// import { createStoreProvider } from '@root/components/GraphEditor/createStoreProviderWithoutImmer'
// import { createStoreProvider } from '@root/components/GraphEditor/createStoreProvider'

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
  localDataRef: React.Ref<{
    initialized: false;
    targetNode: NodeElement | null;
    props: GraphEditorProps;
    issuedClusterId: string|null;
    newClusterBoxSelection: {
      elementIds: string[];
    };
    localNetworkStatistics?: any;
  }>;
  globalNetworkStatistics?: any;
  selectedItem?: ElementData;
  selectedElement?: Element;
  graphEditorRef: React.RefObject<GraphEditorRef>
  networkStatistics?: NetworkStatistics
}

const {
  // store,
  Context,
  useSelector,
  Provider,
} = createStoreProvider<GraphEditor>({} as unknown as GraphEditor, { immer: false })

export const GraphEditorContext = Context
export const GraphEditorProvider = Provider
export const useGraphEditor = useSelector
