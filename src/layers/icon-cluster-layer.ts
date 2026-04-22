import { CompositeLayer } from '@deck.gl/core'
import { ScatterplotLayer, TextLayer } from '@deck.gl/layers'
import Supercluster from 'supercluster'
import type {
  PointFeature,
  ClusterFeature,
  ClusterProperties,
} from 'supercluster'
import type {
  UpdateParameters,
  PickingInfo,
  Color,
  Position,
  AccessorFunction,
  DefaultProps,
} from '@deck.gl/core'

export type IconClusterLayerPickingInfo<DataT> = PickingInfo<
  DataT | (DataT & ClusterProperties),
  { objects?: DataT[] }
>

type ClusterFeatureT<DataT> = PointFeature<DataT> | ClusterFeature<DataT>

export interface IconClusterLayerProps<DataT> {
  data: Iterable<DataT>
  getPosition: AccessorFunction<DataT, Position>
  id: string
  /** Supercluster merge radius in pixels. Lower = clusters split sooner as you zoom. */
  clusterRadius?: number
  /** Retained for backwards compat; no longer affects clustering. */
  sizeScale?: number
  pickable?: boolean
  visible?: boolean
  fillColor?: Color
  strokeColor?: Color
  textColor?: Color
}

const DEFAULT_FILL: Color = [37, 99, 235, 150] // tailwind blue-600 @ ~59% alpha
const DEFAULT_STROKE: Color = [255, 255, 255, 255]
const DEFAULT_TEXT: Color = [255, 255, 255, 255]

const defaultProps: DefaultProps<IconClusterLayerProps<unknown>> = {
  clusterRadius: 36,
  sizeScale: 40,
  pickable: false,
  visible: true,
  fillColor: DEFAULT_FILL,
  strokeColor: DEFAULT_STROKE,
  textColor: DEFAULT_TEXT,
}

function getRadius(count: number): number {
  // Single points are smaller than clusters so the hierarchy reads visually.
  if (count <= 1) return 10
  const bounded = Math.min(1000, count)
  return 14 + Math.sqrt(bounded / 1000) * 20
}

function formatCount(count: number): string {
  if (count < 1000) return String(count)
  if (count < 10_000) return `${(count / 1000).toFixed(1)}k`
  return `${Math.round(count / 1000)}k`
}

export default class IconClusterLayer<
  DataT extends Record<string, unknown> = Record<string, unknown>,
> extends CompositeLayer<IconClusterLayerProps<DataT>> {
  static override defaultProps = defaultProps as DefaultProps<IconClusterLayerProps<Record<string, unknown>>>
  static override layerName = 'IconClusterLayer'

  // @ts-expect-error – extended state
  state: {
    data: ClusterFeatureT<DataT>[]
    index: Supercluster<DataT, DataT>
    z: number
  }

  override shouldUpdateState({ changeFlags }: UpdateParameters<this>) {
    return changeFlags.somethingChanged
  }

  override updateState({ props, oldProps, changeFlags }: UpdateParameters<this>) {
    const rebuildIndex =
      changeFlags.dataChanged || props.clusterRadius !== oldProps.clusterRadius
    if (rebuildIndex) {
      const radius = props.clusterRadius ?? 36
      const index = new Supercluster<DataT, DataT>({
        maxZoom: 18,
        radius,
      })
      const positionAccessor = props.getPosition
      const getPos = typeof positionAccessor === 'function'
        ? positionAccessor
        : () => positionAccessor
      if (!props.data || typeof props.data === 'string' || !(Symbol.iterator in props.data)) return
      const data = [...props.data] as DataT[]
      index.load(
        // @ts-expect-error – Supercluster expects full GeoJSON Feature objects; we pass minimal shape
        data.map((d, i) => ({
          geometry: { coordinates: getPos(d, { index: i, data, target: [] }) },
          properties: d,
        })),
      )
      this.setState({ index })
    }

    // Supercluster floors zoom internally, so using Math.round here gives us
    // a mid-step re-cluster (at z.5) — clusters feel less "stuck" while zooming.
    const z = Math.round(this.context.viewport.zoom)
    if (rebuildIndex || z !== this.state.z) {
      this.setState({
        data: this.state.index.getClusters([-180, -85, 180, 85], z),
        z,
      })
    }
  }

  override getPickingInfo({
    info,
    mode,
  }: {
    info: PickingInfo<ClusterFeatureT<DataT>>
    mode: string
  }): IconClusterLayerPickingInfo<DataT> {
    const pickedObject = info.object?.properties
    if (pickedObject) {
      let objects: DataT[] | undefined
      if (
        'cluster' in pickedObject && pickedObject.cluster &&
        'cluster_id' in pickedObject && typeof pickedObject.cluster_id === 'number' &&
        mode !== 'hover'
      ) {
        objects = this.state.index
          .getLeaves(pickedObject.cluster_id, 1_000_000)
          .map((f) => f.properties)
      }
      return { ...info, object: pickedObject, objects } as unknown as IconClusterLayerPickingInfo<DataT>
    }
    return info as unknown as IconClusterLayerPickingInfo<DataT>
  }

  override renderLayers() {
    const { data } = this.state
    const { fillColor, textColor, pickable } = this.props

    const getCount = (d: ClusterFeatureT<DataT>): number =>
      'point_count' in d.properties && typeof d.properties.point_count === 'number'
        ? d.properties.point_count
        : 1

    const getFeaturePosition = (d: ClusterFeatureT<DataT>): Position => {
      const [lng, lat] = d.geometry.coordinates
      return [lng, lat]
    }

    const circles = new ScatterplotLayer<ClusterFeatureT<DataT>>(
      {
        data,
        pickable: pickable ?? false,
        stroked: false,
        filled: true,
        radiusUnits: 'pixels',
        getPosition: getFeaturePosition,
        getRadius: (d) => getRadius(getCount(d)),
        getFillColor: () => fillColor ?? DEFAULT_FILL,
        radiusMinPixels: 9,
      },
      this.getSubLayerProps({ id: 'circles' }) as Partial<ScatterplotLayer<ClusterFeatureT<DataT>>['props']>,
    )

    // Only clusters get a count label; singletons render as a bare dot.
    const clusterOnly = data.filter((d) => getCount(d) > 1)

    const labels = new TextLayer<ClusterFeatureT<DataT>>(
      {
        data: clusterOnly,
        pickable: false,
        sizeUnits: 'pixels',
        getPosition: getFeaturePosition,
        getText: (d) => formatCount(getCount(d)),
        getSize: (d) => {
          const count = getCount(d)
          return Math.min(15, Math.max(10, getRadius(count) * 0.75))
        },
        getColor: () => textColor ?? DEFAULT_TEXT,
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        fontWeight: 700,
        getTextAnchor: 'middle',
        getAlignmentBaseline: 'center',
        characterSet: 'auto',
      },
      this.getSubLayerProps({ id: 'labels' }) as Partial<TextLayer<ClusterFeatureT<DataT>>['props']>,
    )

    return [circles, labels]
  }
}
