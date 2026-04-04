import { CompositeLayer } from '@deck.gl/core'
import { IconLayer, type IconLayerProps } from '@deck.gl/layers'
import Supercluster from 'supercluster'
import type {
  PointFeature,
  ClusterFeature,
  ClusterProperties,
} from 'supercluster'
import type { UpdateParameters, PickingInfo } from '@deck.gl/core'

export type IconClusterLayerPickingInfo<DataT> = PickingInfo<
  DataT | (DataT & ClusterProperties),
  { objects?: DataT[] }
>

function getIconName(size: number): string {
  if (size === 0) return ''
  if (size < 10) return `marker-${size}`
  if (size < 100) return `marker-${Math.floor(size / 10)}0`
  return 'marker-100'
}

function getIconSize(size: number): number {
  return Math.min(100, size) / 100 + 1
}

export default class IconClusterLayer<
  DataT extends Record<string, unknown> = Record<string, unknown>,
  ExtraProps extends object = object,
> extends CompositeLayer<Required<IconLayerProps<DataT>> & ExtraProps> {
  // @ts-expect-error – extended state
  state: {
    data: (PointFeature<DataT> | ClusterFeature<DataT>)[]
    index: Supercluster<DataT, DataT>
    z: number
  }

  override shouldUpdateState({ changeFlags }: UpdateParameters<this>) {
    return changeFlags.somethingChanged
  }

  override updateState({ props, oldProps, changeFlags }: UpdateParameters<this>) {
    const rebuildIndex =
      changeFlags.dataChanged || props.sizeScale !== oldProps.sizeScale
    if (rebuildIndex) {
      const index = new Supercluster<DataT, DataT>({
        maxZoom: 16,
        radius: props.sizeScale * Math.sqrt(2),
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

    const z = Math.floor(this.context.viewport.zoom)
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
    info: PickingInfo<PointFeature<DataT> | ClusterFeature<DataT>>
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
    const { iconAtlas, iconMapping, sizeScale } = this.props

    return new IconLayer<PointFeature<DataT> | ClusterFeature<DataT>>(
      {
        data,
        iconAtlas,
        iconMapping,
        sizeScale,
        getPosition: (d) => {
          const [lng, lat] = d.geometry.coordinates
          return [lng, lat] satisfies [number, number]
        },
        getIcon: (d) =>
          getIconName(
            'point_count' in d.properties && typeof d.properties.point_count === 'number'
              ? d.properties.point_count : 1,
          ),
        getSize: (d) =>
          getIconSize(
            'point_count' in d.properties && typeof d.properties.point_count === 'number'
              ? d.properties.point_count : 1,
          ),
      },
      this.getSubLayerProps({ id: 'icon' }),
    )
  }
}
