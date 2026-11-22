import { useMemo } from 'react'
import { Background, Controls, Handle, MiniMap, Position, ReactFlow } from '@xyflow/react'
import { Check, LockKeyhole, Play } from 'lucide-react'
import { getTopicStatus } from '../data/roadmaps'

function TopicNode({ data }) {
  const Icon = data.status === 'completed' ? Check : data.status === 'locked' ? LockKeyhole : Play
  const positions = { top: Position.Top, right: Position.Right, bottom: Position.Bottom, left: Position.Left }
  return <div className={`roadmap-node node-${data.status}`}>
    <Handle className="node-handle" id={`target-${data.targetSide}`} type="target" position={positions[data.targetSide]} isConnectable={false} />
    <div className="node-topline"><span className="node-index">{String(data.index + 1).padStart(2, '0')}</span><span className={`node-status-dot dot-${data.status}`}><Icon size={12} /></span></div>
    <strong>{data.title}</strong><span className="node-duration">{data.hours}h learning time</span>
    <span className="node-state">{data.status === 'in-progress' ? 'Up next' : data.status}</span>
    <Handle className="node-handle" id={`source-${data.sourceSide}`} type="source" position={positions[data.sourceSide]} isConnectable={false} />
  </div>
}

const nodeTypes = { topic: TopicNode }

export default function RoadmapCanvas({ career, completed, onSelectTopic }) {
  const { nodes, edges } = useMemo(() => {
    const nodes = career.topics.map((topic, index) => {
      const column = Math.floor(index / 4)
      const row = index % 4
      const targetSide = row === 0 ? 'left' : column % 2 === 0 ? 'top' : 'bottom'
      const sourceSide = row === 3 || index === career.topics.length - 1 ? 'right' : column % 2 === 0 ? 'bottom' : 'top'
      return {
        id: topic.id, type: 'topic', position: { x: column % 2 === 0 ? column * 300 : column * 300, y: (column % 2 === 0 ? row : 3 - row) * 145 },
        data: { ...topic, index, targetSide, sourceSide, status: getTopicStatus(career, completed, index) },
      }
    })
    const edges = career.topics.slice(1).map((topic, index) => ({
      id: `${career.topics[index].id}-${topic.id}`, source: career.topics[index].id, target: topic.id,
      sourceHandle: `source-${nodes[index].data.sourceSide}`, targetHandle: `target-${nodes[index + 1].data.targetSide}`,
      type: 'smoothstep', animated: getTopicStatus(career, completed, index + 1) === 'in-progress',
      style: { stroke: completed.includes(career.topics[index].id) ? '#7658e8' : 'var(--border-strong)', strokeWidth: 2 },
    }))
    return { nodes, edges }
  }, [career, completed])

  return <div className="flow-wrap">
    <div className="flow-legend"><span><i className="legend-dot complete" />Completed</span><span><i className="legend-dot current" />In progress</span><span><i className="legend-dot upcoming" />Upcoming</span><span><i className="legend-dot locked" />Locked</span></div>
    <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} onNodeClick={(_, node) => onSelectTopic(node.id)} fitView fitViewOptions={{ padding: 0.18 }} minZoom={0.25} maxZoom={1.6} nodesDraggable={false} nodesConnectable={false} elementsSelectable>
      <Background color="var(--flow-dots)" gap={20} size={1} />
      <Controls />
      <MiniMap nodeColor={(node) => ({ completed: '#7658e8', 'in-progress': '#f0a94f', upcoming: '#8d96aa', locked: '#d9dce6' })[node.data.status] || '#7658e8'} maskColor="rgba(246,247,251,.72)" />
    </ReactFlow>
  </div>
}
