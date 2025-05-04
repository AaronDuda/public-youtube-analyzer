import type { HitTargets, Node, Relationship } from '@neo4j-nvl/base'
import { InteractiveNvlWrapper } from '@neo4j-nvl/react'
import type { MouseEventCallbacks } from '@neo4j-nvl/react'

export type GraphProps = {
    graph: VideoGraphData | undefined;
};

type VideoProperties = {
    comments: { low: number, high: number },
    rate: number,
    ratings: { low: number, high: number },
    length: { low: number, high: number },
    id: string,
    age: { low: number, high: number },
    views: { low: number, high: number }
};

type VideoNode = Node & {
    identity: { low: number, high: number },
    labels: string[],
    properties: VideoProperties,
    elementId: string
};

type VideoRelationship = Relationship & {
    identity: { low: number, high: number },
    start: { low: number, high: number },
    end: { low: number, high: number },
    type: string,
    properties: object,
    elementId: string,
    startNodeElementId: string,
    endNodeElementId: string
};

type CategoryNode = Node & {
    identity: { low: number, high: number },
    labels: string[],
    properties: { category: string },
    elementId: string
};

type UploaderNode = Node & {
    identity: { low: number, high: number },
    labels: string[],
    properties: { uploader: string },
    elementId: string
};

export type VideoGraphData = {
    data: {
        video: VideoNode[][],
        related_video: VideoNode[][],
        category: CategoryNode[][],
        uploader: UploaderNode[][],
        uploaded_by: VideoRelationship[][],
        related_to: VideoRelationship[][],
        video_type: VideoRelationship[][]
    },
    statistics: {
        video_count: number,
        related_video_count: number,
        category_count: number,
        uploader_count: number,
        total_nodes: number
    }
};

  
  

export default function Graph(props : GraphProps) {
  const mouseEventCallbacks: MouseEventCallbacks = {
    onHover: (element: Node | Relationship, hitTargets: HitTargets, evt: MouseEvent) =>
      console.log('onHover', element, hitTargets, evt),
    onRelationshipRightClick: (rel: Relationship, hitTargets: HitTargets, evt: MouseEvent) =>
      console.log('onRelationshipRightClick', rel, hitTargets, evt),
    onNodeClick: (node: Node, hitTargets: HitTargets, evt: MouseEvent) =>
      console.log('onNodeClick', node, hitTargets, evt),
    onNodeRightClick: (node: Node, hitTargets: HitTargets, evt: MouseEvent) =>
      console.log('onNodeRightClick', node, hitTargets, evt),
    onNodeDoubleClick: (node: Node, hitTargets: HitTargets, evt: MouseEvent) =>
      console.log('onNodeDoubleClick', node, hitTargets, evt),
    onRelationshipClick: (rel: Relationship, hitTargets: HitTargets, evt: MouseEvent) =>
      console.log('onRelationshipClick', rel, hitTargets, evt),
    onRelationshipDoubleClick: (rel: Relationship, hitTargets: HitTargets, evt: MouseEvent) =>
      console.log('onRelationshipDoubleClick', rel, hitTargets, evt),
    onCanvasClick: (evt: MouseEvent) => console.log('onCanvasClick', evt),
    onCanvasDoubleClick: (evt: MouseEvent) => console.log('onCanvasDoubleClick', evt),
    onCanvasRightClick: (evt: MouseEvent) => console.log('onCanvasRightClick', evt),
    onDrag: (nodes: Node[]) => console.log('onDrag', nodes),
    onZoom: (zoomLevel: number) => console.log('onZoom', zoomLevel)
  }

  return (
    <>
      <div
        style={{
          margin: 10,
          borderRadius: 25,
          border: '2px solid #FF0000',
          height: 500,
          background: `radial-gradient(circle, #FFF 0%, #F0FFFA 100%)`,
          boxShadow: `2px -2px 10px grey`
        }}
      >
        <InteractiveNvlWrapper
          nodes={props?.graph?.data ? [...props.graph.data.video[0], ...props.graph.data.related_video[0], ...props.graph.data.uploader[0], ...props.graph.data.category[0]] : []}
          rels={props?.graph?.data ? [...props.graph.data.related_to[0], ...props.graph.data.uploaded_by[0], ...props.graph.data.video_type[0]]: []}
          mouseEventCallbacks={mouseEventCallbacks}
          onClick={(evt) => console.log('custom click event', evt)}
        />
      </div>
    </>
  )
}
