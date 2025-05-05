import type { HitTargets, Node, Relationship } from '@neo4j-nvl/base'
import { InteractiveNvlWrapper } from '@neo4j-nvl/react'
import type { MouseEventCallbacks } from '@neo4j-nvl/react'

export type GraphProps = {
    graph: VideoGraphData | undefined;
};

type Neo4jNode = Node & {
    identity: { low: number, high: number },
    labels: string[],
    properties: Record<string, any>,
    elementId: string
};
  
type Neo4jRelationship = Relationship & {
    identity: { low: number, high: number },
    start: { low: number, high: number },
    end: { low: number, high: number },
    type: string,
    properties: object,
    elementId: string,
    startNodeElementId: string,
    endNodeElementId: string
}

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
        video: VideoNode[][] | undefined,
        related_video: VideoNode[][] | undefined,
        category: CategoryNode[][] | undefined,
        uploader: UploaderNode[][] | undefined,
        uploaded_by: VideoRelationship[][] | undefined,
        related_to: VideoRelationship[][] | undefined,
        video_type: VideoRelationship[][] | undefined
    },
    statistics: {
        video_count: number,
        related_video_count: number,
        category_count: number,
        uploader_count: number,
        total_nodes: number
    }
};

const convertNeo4jNodeToGraphNode = (nodes: Neo4jNode[], color: string) => (
    nodes.map(node => ({
        id: String(node.identity.low),
        color: color,
        data: {
            label: node.labels[0],
            ...node.properties,
        }
    }))
);


const convertNeo4jRelationshipToGraphRelationship = (rels: Neo4jRelationship[]) => (
    rels.map(rel => ({
        id: String(rel.identity.low),
        from: String(rel.start.low),
        to: String(rel.end.low),
        data: {
            source: String(rel.start.low),
            target: String(rel.end.low),
            label: rel.type,
            ...rel.properties
        },
    }))
);
  
  

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

  let videos = props?.graph?.data?.video ? convertNeo4jNodeToGraphNode(props.graph.data.video[0], 'green') : [];
  let related_video = props?.graph?.data?.related_video ? convertNeo4jNodeToGraphNode(props.graph.data.related_video[0], 'green') : [];
  let uploaders = props?.graph?.data?.uploader ? convertNeo4jNodeToGraphNode(props.graph.data.uploader[0], 'yellow') : [];
  let categories = props?.graph?.data?.category ? convertNeo4jNodeToGraphNode(props.graph.data.category[0], 'red') : [];
  let related_to = props?.graph?.data?.related_to ? convertNeo4jRelationshipToGraphRelationship(props.graph.data.related_to[0]) : [];
  let uploaded_by = props?.graph?.data?.uploaded_by ? convertNeo4jRelationshipToGraphRelationship(props.graph.data.uploaded_by[0]) : [];
  let video_type = props?.graph?.data?.video_type ? convertNeo4jRelationshipToGraphRelationship(props.graph.data.video_type[0]) : [];

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
          nodes={[
                ...videos,
                ...related_video,
                ...uploaders,
                ...categories
              ]}
          rels={[
                ...related_to, 
                ...video_type, 
                ...uploaded_by
            ]}
          mouseEventCallbacks={mouseEventCallbacks}
          onClick={(evt) => console.log('custom click event', evt)}
        />
      </div>
    </>
  )
}
