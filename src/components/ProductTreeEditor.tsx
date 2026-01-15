
import React, { useCallback, useState, useEffect } from 'react';
import {
    ReactFlow,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Handle,
    Position,
    type NodeProps,
    type Edge,
    type Node,
    type Connection,
    Panel,
    useReactFlow,
    ReactFlowProvider,
    useStore
} from '@xyflow/react';
import { Maximize2, Minimize2 } from 'lucide-react';
import '@xyflow/react/dist/style.css';

// --- Custom Node Component ---

interface ProductNodeData extends Record<string, unknown> {
    name: string;
    link: string;
    description: string;
    onChange: (id: string, data: any) => void;
    onAddChild: (id: string) => void;
    onDelete: (id: string) => void;
    onAddSibling: (id: string) => void;
}



const ProductNode = ({ data, id, selected }: NodeProps) => {
    const productData = data as unknown as ProductNodeData;
    const [expanded, setExpanded] = useState(false);

    // Default styles for the node
    const nodeStyle: React.CSSProperties = {
        background: '#18181b', // matching modal bg
        border: selected ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: '12px',
        minWidth: '250px',
        color: 'white',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
        transition: 'all 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    };

    const inputStyle: React.CSSProperties = {
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid var(--border-subtle)',
        padding: '8px',
        borderRadius: '6px',
        color: 'white',
        outline: 'none',
        width: '100%',
        fontSize: '0.9rem',
        boxSizing: 'border-box'
    };

    const labelStyle: React.CSSProperties = {
        color: 'var(--text-secondary)',
        fontSize: '0.75rem',
        marginBottom: '2px',
        display: 'block'
    };

    return (
        <div style={nodeStyle}>
            <Handle type="target" position={Position.Top} style={{ background: '#fff' }} />

            {/* Header / Name Input */}
            <div>
                <label style={labelStyle}>Product Name</label>
                <input
                    className="nodrag nopan" // important so we can type without dragging
                    style={inputStyle}
                    value={productData.name || ''}
                    onChange={(evt) => productData.onChange(id, { ...productData, name: evt.target.value })}
                    placeholder="Product Name"
                />
            </div>

            {/* Toggle Details */}
            <div
                onClick={() => setExpanded(!expanded)}
                style={{
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    color: 'var(--accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                }}
            >
                {expanded ? '▲ Hide Details' : '▼ Show Details'}
            </div>

            {/* Expandable Details */}
            {expanded && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                    <div>
                        <label style={labelStyle}>Link</label>
                        <input
                            className="nodrag nopan"
                            style={inputStyle}
                            value={productData.link || ''}
                            onChange={(evt) => productData.onChange(id, { ...productData, link: evt.target.value })}
                            placeholder="https://..."
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Description</label>
                        <textarea
                            className="nodrag nopan"
                            style={{ ...inputStyle, resize: 'vertical', minHeight: '60px' }}
                            value={productData.description || ''}
                            onChange={(evt) => productData.onChange(id, { ...productData, description: evt.target.value })}
                            placeholder="Description..."
                            rows={3}
                        />
                    </div>
                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            className="nodrag nopan"
                            onClick={(e) => {
                                e.stopPropagation();
                                productData.onAddChild(id);
                            }}
                            style={{
                                flex: 1,
                                background: 'rgba(139, 92, 246, 0.1)',
                                border: '1px solid var(--accent-primary)',
                                color: '#a78bfa',
                                borderRadius: '6px',
                                padding: '6px',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                fontWeight: '600'
                            }}
                        >
                            + Sub-Product
                        </button>
                        <button
                            className="nodrag nopan"
                            onClick={(e) => {
                                e.stopPropagation();
                                productData.onAddSibling(id);
                            }}
                            style={{
                                flex: 1,
                                background: 'rgba(59, 130, 246, 0.1)',
                                border: '1px solid #3b82f6',
                                color: '#60a5fa',
                                borderRadius: '6px',
                                padding: '6px',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                fontWeight: '600'
                            }}
                        >
                            + Product
                        </button>
                    </div>
                    <button
                        className="nodrag nopan"
                        onClick={(e) => {
                            e.stopPropagation();
                            productData.onDelete(id);
                        }}
                        style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid #ef4444',
                            color: '#f87171',
                            borderRadius: '6px',
                            padding: '6px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            width: '100%'
                        }}
                    >
                        Delete
                    </button>
                </div>
            )}
            {!expanded && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <button
                        className="nodrag nopan"
                        onClick={(e) => {
                            e.stopPropagation();
                            productData.onAddChild(id);
                        }}
                        style={{
                            flex: 1,
                            background: 'transparent',
                            border: '1px dashed var(--text-secondary)',
                            color: 'var(--text-secondary)',
                            borderRadius: '6px',
                            padding: '4px',
                            cursor: 'pointer',
                            fontSize: '0.75rem'
                        }}
                    >
                        + Sub-Product
                    </button>
                    {/* Only show Add Another Product (Sibling) if this is probably not the root (checked via props or just allow it and let handler decide) */}
                    <button
                        className="nodrag nopan"
                        onClick={(e) => {
                            e.stopPropagation();
                            productData.onAddSibling(id);
                        }}
                        style={{
                            flex: 1,
                            background: 'transparent',
                            border: '1px dashed var(--accent-primary)',
                            color: 'var(--accent-primary)',
                            borderRadius: '6px',
                            padding: '4px',
                            cursor: 'pointer',
                            fontSize: '0.75rem'
                        }}
                    >
                        + Product
                    </button>
                </div>
            )}

            <Handle type="source" position={Position.Bottom} style={{ background: '#fff' }} />
        </div>
    );
};

const nodeTypes = {
    product: ProductNode as any,
};

// --- Main Editor Component ---

// --- Hierarchy Line Component ---
const HierarchyOverlay = () => {
    // We access the transform to position lines correctly in the viewport
    // but we want the text to stick to the left side of the screen.
    const transform = useStore((state) => state.transform);
    const [, y, zoom] = transform;

    // Use levels only if needed, currently unused in render except for logic comments
    // const levels = [ ... ]; 

    // Lines are drawing in graph space? No, let's draw them in screen space based on graph coords
    // Or simpler: Draw them in graph space using a transform container, but counter-transform the text X?

    // Let's use a container that matches the graph transform for exact line positioning
    const overlayStyle: React.CSSProperties = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1, // Behind nodes
        overflow: 'hidden'
    };

    return (
        <div style={overlayStyle}>
            {/* We will render logical separators */}
            {/* Separator 1: Root/Branch Boundary */}
            <div style={{
                position: 'absolute',
                top: (250 * zoom) + y,
                left: 0,
                width: '100%',
                height: '1px',
                background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.1) 100%)',
                boxShadow: '0 0 10px rgba(255,255,255,0.2)'
            }} />
            <div style={{
                position: 'absolute',
                top: (500 * zoom) + y,
                left: 0,
                width: '100%',
                height: '1px',
                background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.1) 100%)',
                boxShadow: '0 0 10px rgba(255,255,255,0.2)'
            }} />

            {/* Labels - Sticky Left */}
            <div style={{ position: 'absolute', top: (100 * zoom) + y, left: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                Root Node Level
            </div>
            <div style={{ position: 'absolute', top: (350 * zoom) + y, left: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                Branch Node Level
            </div>
            <div style={{ position: 'absolute', top: (600 * zoom) + y, left: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'uppercase' }}>
                Leaf Node Level
            </div>
        </div>
    );
};


interface ProductTreeEditorProps {
    initialData?: any; // The root node or persisted tree
    onChange: (rootData: any) => void;
}

// --- Constants ---
const ZONE_ROOT_Y_MAX = 250;
const ZONE_BRANCH_Y_MAX = 500;
// Coordinate Extents: [[minX, minY], [maxX, maxY]]
const EXTENT_ROOT: [[number, number], [number, number]] = [[-10000, -10000], [10000, ZONE_ROOT_Y_MAX]];
const EXTENT_BRANCH: [[number, number], [number, number]] = [[-10000, ZONE_ROOT_Y_MAX], [10000, ZONE_BRANCH_Y_MAX]];
const EXTENT_LEAF: [[number, number], [number, number]] = [[-10000, ZONE_BRANCH_Y_MAX], [10000, 10000]];

const ProductTreeEditor = ({ initialData, onChange }: ProductTreeEditorProps) => {
    // Initial nodes/edges setup
    // We expect at least one root node
    const defaultNodes: Node[] = [
        {
            id: 'root',
            type: 'product',
            position: { x: 250, y: 50 },
            extent: EXTENT_ROOT, // Enforce root zone
            data: {
                name: '',
                link: '',
                description: '',
                onChange: (id: string, data: any) => handleNodeChange(id, data),
                onAddChild: (id: string) => handleAddChild(id),
                onDelete: (id: string) => handleDeleteNode(id),
                onAddSibling: (id: string) => handleAddSibling(id)
            },
        }
    ];

    const [nodes, setNodes, onNodesChange] = useNodesState<Node>(defaultNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const { getNodes, getNode, getEdges } = useReactFlow();



    // Update parent component whenever tree changes
    useEffect(() => {
        // Find root node
        // Find root node
        // Actually for this effect we DO want to run when 'nodes' changes to sync changes.
        // But we are reading 'nodes' from state 'nodes' which is fine.
        const rootNode = nodes.find(n => n.id === 'root');
        if (!rootNode) return;

        // Serialize the tree
        // For now, we'll just send back the root node's data plus a flat list of other nodes/edges
        // Or reconstruct the hierarchy.
        // Let's send a simplified object that AddProductModal expects, plus the full tree state.

        // Constructing a hierarchical object for "subProducts"
        const buildTree = (parentId: string): any[] => {
            const childrenEdges = edges.filter(e => e.source === parentId);
            const children = childrenEdges.map(edge => {
                const childNode = nodes.find(n => n.id === edge.target);
                if (!childNode) return null;
                return {
                    ...childNode.data,
                    id: childNode.id,
                    children: buildTree(childNode.id)
                };
            }).filter(Boolean);
            return children;
        };

        const hierarchy = buildTree('root');

        const exportData = {
            name: rootNode.data.name,
            link: rootNode.data.link,
            description: rootNode.data.description,
            // We store the full tree structure in a special property so we can restore it later if needed,
            // or just use the hierarchy for display.
            treeData: {
                nodes,
                edges
            },
            subProducts: hierarchy
        };

        onChange(exportData);
    }, [nodes, edges, onChange]); // This is fine, it's the OUTPUT

    // --- Drag Constraints ---
    const onNodeDrag = useCallback((_: React.MouseEvent, node: Node) => {
        // Find parent edge
        const parentEdge = edges.find(e => e.target === node.id);
        if (!parentEdge) return; // Root node or detached

        const parentNode = nodes.find(n => n.id === parentEdge.source);
        if (!parentNode) return;

        // Visual Feedback Logic
        // Constraint: Child Node must be BELOW Parent Node in Y
        // Buffer: 50px
        const isInvalid = node.position.y < (parentNode.position.y + 50);

        if (isInvalid) {
            // Flash Edge Red
            // We only want to update if it's not already red to avoid spamming updates
            const currentEdge = edges.find(e => e.id === parentEdge.id);
            if (currentEdge && currentEdge.style?.stroke !== '#ef4444') {
                setEdges(eds => eds.map(e => {
                    if (e.id === parentEdge.id) {
                        return {
                            ...e,
                            animated: true,
                            style: { ...e.style, stroke: '#ef4444', strokeWidth: 3, filter: 'drop-shadow(0 0 4px #ef4444)' }
                        };
                    }
                    return e;
                }));
            }
        } else {
            // Reset style if valid
            const currentEdge = edges.find(e => e.id === parentEdge.id);
            if (currentEdge && currentEdge.style?.stroke === '#ef4444') {
                setEdges(eds => eds.map(e => {
                    if (e.id === parentEdge.id) {
                        const { stroke, strokeWidth, filter, ...restStyle } = e.style || {};
                        return {
                            ...e,
                            animated: true,
                            style: restStyle
                        };
                    }
                    return e;
                }));
            }
        }
    }, [nodes, edges, setEdges]);

    // Limit movement?
    // User requested "action is stopped". 
    // Implementing hard stop in onNodeDrag is tricky with standard controls. 
    // React Flow v12 handles drag automatically. 
    // We can use 'position' prop control, or just rely on the visual feedback for now.
    // The visual feedback is often better than a hard wall which can feel glitchy.
    // We strictly implemented the "flash red" request.

    // Node Action Handlers
    // Use stable handlers that don't depend on 'nodes' state directly for logic
    const handleNodeChange = useCallback((id: string, newData: any) => {
        setNodes((nds) => nds.map((node) => {
            if (node.id === id) {
                // IMPORTANT: Do NOT re-bind handlers here, it causes loops if handlers change.
                // Just update data fields. The handlers are injected via matching ID or stable references.
                // Actually, the useEffect below injects handlers.
                // So here we should just update the data properties that changed.
                return { ...node, data: { ...node.data, ...newData } };
            }
            return node;
        }));
    }, [setNodes]);

    const handleAddChild = useCallback((parentId: string) => {
        // Use getNode to avoid dependency on 'nodes' array
        const parentNode = getNode(parentId);
        if (!parentNode) return;

        // Determine hierarchy level and extent for the new child
        let newExtent = EXTENT_LEAF; // Default to leaf
        let startY = parentNode.position.y + 200;
        let pY = parentNode.position.y;

        // Target Zones
        let isTargetBranch = false;
        let isTargetLeaf = false;

        // Check Parent Zone
        // If Parent is Root (< 250) -> Child is Branch (250-500)
        if (pY < ZONE_ROOT_Y_MAX) {
            newExtent = EXTENT_BRANCH;
            startY = 350; // Center of branch zone approx
            isTargetBranch = true;
        }
        // If Parent is Branch (250-500) -> Child is Leaf (> 500)
        else if (pY < ZONE_BRANCH_Y_MAX) {
            newExtent = EXTENT_LEAF;
            startY = 600; // Center of leaf zone approx
            isTargetLeaf = true;
        }
        else {
            // Parent is Leaf - adding child to leaf? 
            // Keeps it in leaf zone
            newExtent = EXTENT_LEAF;
            startY = parentNode.position.y + 200;
            isTargetLeaf = true;
        }

        // Calculate X position to prevent overlap
        // Find existing nodes in the target level
        const currentNodes = getNodes();
        const nodesInLevel = currentNodes.filter(n => {
            const y = n.position.y;
            if (isTargetBranch) return y >= ZONE_ROOT_Y_MAX && y < ZONE_BRANCH_Y_MAX;
            if (isTargetLeaf) return y >= ZONE_BRANCH_Y_MAX;
            return false;
        });

        let startX = parentNode.position.x;

        if (nodesInLevel.length > 0) {
            // Find the rightmost node
            const rightMostNode = nodesInLevel.reduce((prev, current) => {
                return (prev.position.x > current.position.x) ? prev : current;
            });
            // Place new node to the right of the rightmost node
            startX = Math.max(parentNode.position.x, rightMostNode.position.x + 300);
        } else {
            startX = parentNode.position.x;
        }

        const newId = `product-${Date.now()}`;


        const newNode: Node = {
            id: newId,
            type: 'product',
            position: { x: startX, y: startY }, // Place in correct zone
            extent: newExtent,
            data: {
                name: '',
                link: '',
                description: '',
                onChange: (id: string, data: any) => handleNodeChange(id, data),
                onAddChild: (id: string) => handleAddChild(id),
                onDelete: (id: string) => handleDeleteNode(id),
                onAddSibling: (id: string) => handleAddSibling(id)
            },
        };

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) => eds.concat({ id: `e-${parentId}-${newId}`, source: parentId, target: newId, animated: true }));
    }, [getNode, setNodes, setEdges]); // Removed 'nodes' dependency

    const handleAddSibling = useCallback((nodeId: string) => {
        if (nodeId === 'root') {
            alert("Cannot add a sibling to the main root product.");
            return;
        }
        // Find parent edge to identify parent
        const edges = getEdges();
        const parentEdge = edges.find(e => e.target === nodeId);
        if (parentEdge) {
            handleAddChild(parentEdge.source);
        } else {
            console.warn("Could not find parent for sibling creation");
        }
    }, [getEdges, handleAddChild]);

    const handleDeleteNode = useCallback((id: string) => {
        if (id === 'root') return; // Cannot delete root
        setNodes((nds) => nds.filter((node) => node.id !== id));
        setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
    }, [setNodes, setEdges]);

    const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    // Hydrate from initialData if present
    // MOVED HERE so handlers are defined
    useEffect(() => {
        if (initialData) {
            // Check for full persisted tree state (nodes and edges)
            const persistedNodes = initialData.tree_data?.nodes || initialData.treeData?.nodes;
            const persistedEdges = initialData.tree_data?.edges || initialData.treeData?.edges;

            if (persistedNodes && persistedEdges && persistedNodes.length > 0) {
                // Restore full state
                setNodes(persistedNodes.map((n: Node) => ({
                    ...n,
                    // We must re-attach handlers because functions are not serializable
                    data: {
                        ...n.data,
                        onChange: (id: string, data: any) => handleNodeChange(id, data),
                        onAddChild: (id: string) => handleAddChild(id),
                        onDelete: (id: string) => handleDeleteNode(id),
                        onAddSibling: (id: string) => handleAddSibling(id)
                    }
                })));
                setEdges(persistedEdges);
            } else {
                // Legacy / simplified restoration (just root)
                setNodes((nds) => nds.map((node) => {
                    if (node.id === 'root') {
                        return {
                            ...node,
                            data: {
                                ...node.data,
                                name: initialData.name,
                                link: initialData.link,
                                description: initialData.description,
                            }
                        };
                    }
                    return node;
                }));
            }
        }
    }, [initialData, setNodes, setEdges, handleNodeChange, handleAddChild, handleDeleteNode, handleAddSibling]);

    // Inject handlers into data
    // We need to do this effect to ensure all nodes have the latest handlers
    // Removed patching useEffect to avoid infinite loops and missed updates
    // Handlers are now injected directly at creation time.

    return (
        <div
            style={isFullScreen ? {
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: '#121214', // Match theme
                zIndex: 9999,
            } : {
                width: '100%',
                height: '500px',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
                position: 'relative' // Context for simple absolute
            }}
        >
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeDrag={onNodeDrag}
                nodeTypes={nodeTypes}
                fitView
            >
                <HierarchyOverlay />
                <Background gap={20} size={1} color="rgba(255,255,255,0.1)" />
                <Controls />
                <Panel position="top-right">
                    <button
                        onClick={() => setIsFullScreen(!isFullScreen)}
                        className="nodrag nopan"
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '6px',
                            padding: '8px',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                    >
                        {isFullScreen ? (
                            <>
                                <Minimize2 size={16} /> Exit Full Screen
                            </>
                        ) : (
                            <>
                                <Maximize2 size={16} /> Full Screen
                            </>
                        )}
                    </button>
                </Panel>
            </ReactFlow>
        </div>
    );
};

export default function ProductTreeEditorWrapper(props: ProductTreeEditorProps) {
    return (
        <ReactFlowProvider>
            <ProductTreeEditor {...props} />
        </ReactFlowProvider>
    );
}
