import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography
} from "@mui/material";
import { TreeView } from "@mui/lab";
import TreeItem from "@mui/lab/TreeItem";
import { ChevronDown, ChevronRight, FolderIcon, Pencil, Trash2, Share2, Monitor } from "lucide-react";
import { EditNameDialog } from './edit-name-dialog';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export interface TreeNode {
    id: string;
    name: string;
    type: 'folder' | 'edit';
    children?: TreeNode[];
}

export const EditsPanel = () => {
    const [selectedNode, setSelectedNode] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);
    const [nodes, setNodes] = useState<TreeNode[]>([
        {
            id: "root",
            name: "ROOT",
            type: 'folder',
            children: []
        }
    ]);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [nodeToEdit, setNodeToEdit] = useState<{ edit: TreeNode; isFolder: boolean } | null>(null);
    const [expanded, setExpanded] = useState<string[]>([]);

    const handleNewFolder = () => {
        setNewFolderName("");
        setIsDialogOpen(true);
    };

    const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
        setExpanded(nodeIds);
    };

    const createNewFolder = () => {
        if (!newFolderName.trim()) return;

        const newNode: TreeNode = {
            id: `folder-${Date.now()}`,
            name: newFolderName,
            type: 'folder',
            children: []
        };

        console.log('Creating new folder:', newNode);
        console.log('Selected node:', selectedNode);

        if (!selectedNode) {
            setNodes(prevNodes => {
                const newNodes = [...prevNodes, newNode];
                console.log('New nodes state:', newNodes);
                return newNodes;
            });
        } else {
            setNodes(prevNodes => {
                const updateNode = (node: TreeNode): TreeNode => {
                    if (node.id === selectedNode) {
                        return {
                            ...node,
                            children: [...(node.children || []), newNode]
                        };
                    }
                    if (node.children) {
                        return {
                            ...node,
                            children: node.children.map(updateNode)
                        };
                    }
                    return node;
                };

                const newNodes = prevNodes.map(updateNode);
                console.log('Updated nodes state:', newNodes);
                return newNodes;
            });

            setExpanded(prev => [...prev, selectedNode]);
        }

        setIsDialogOpen(false);
        setNewFolderName("");
    };

    const handleNewEdit = () => {
        if (!selectedNode) return;

        const newEdit: TreeNode = {
            id: `edit-${Date.now()}`,
            name: `Edit ${Date.now()}`,
            type: 'edit'
        };

        const updateNodesRecursively = (nodes: TreeNode[]): TreeNode[] => {
            return nodes.map(node => {
                if (node.id === selectedNode) {
                    return {
                        ...node,
                        children: [...(node.children || []), newEdit]
                    };
                }
                if (node.children) {
                    return {
                        ...node,
                        children: updateNodesRecursively(node.children)
                    };
                }
                return node;
            });
        };

        setNodes(updateNodesRecursively(nodes));
    };

    const handleEditName = (node: TreeNode) => {
        setNodeToEdit({
            edit: node,
            isFolder: node.type === 'folder'
        });
        setEditDialogOpen(true);
    };

    const renderTree = (node: TreeNode) => (
        <TreeItem
            key={node.id}
            nodeId={node.id}
            label={
                <div
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' }}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                >
                    {node.type === 'folder' ? (
                        <FolderIcon className="h-4 w-4" style={{ color: '#4CAF50' }} />
                    ) : (
                        <Pencil className="h-4 w-4" style={{ color: '#9e9e9e' }} />
                    )}
                    <Typography
                        sx={{
                            fontSize: '0.875rem',
                            flexGrow: 1,
                            color: '#e4e4e7'
                        }}
                    >
                        {node.name}
                    </Typography>
                    {hoveredNode === node.id && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Button
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditName(node);
                                }}
                                sx={{ minWidth: 0, p: 0.5 }}
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button size="small" sx={{ minWidth: 0, p: 0.5 }}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            {node.type === 'edit' && (
                                <>
                                    <Button size="small" sx={{ minWidth: 0, p: 0.5 }}>
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                    <Button size="small" sx={{ minWidth: 0, p: 0.5 }}>
                                        <Monitor className="h-4 w-4" />
                                    </Button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            }
            onClick={(e) => {
                e.stopPropagation();
                setSelectedNode(node.id);
                console.log('Selected node:', node.id);
            }}
        >
            {node.children && node.children.length > 0
                ? node.children.map((child) => renderTree(child))
                : null}
        </TreeItem>
    );

    return (
        <div style={{ padding: '16px', height: '100%', backgroundColor: 'rgba(31, 41, 55, 0.4)' }}>
            <Typography variant="h6" sx={{ color: '#e4e4e7', mb: 2 }}>
                My Edits
            </Typography>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <Button
                    variant="contained"
                    onClick={handleNewFolder}
                    sx={{
                        backgroundColor: '#4b5563',
                        '&:hover': { backgroundColor: '#374151' }
                    }}
                >
                    NEW FOLDER
                </Button>
                <Button
                    variant="contained"
                    onClick={handleNewEdit}
                    disabled={!selectedNode}
                    sx={{
                        backgroundColor: '#4b5563',
                        '&:hover': { backgroundColor: '#374151' }
                    }}
                >
                    NEW EDIT
                </Button>
            </div>

            <TreeView
                expanded={expanded}
                onNodeToggle={handleToggle}
                defaultExpanded={['root']}
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                sx={{
                    height: 'calc(100vh - 200px)',
                    overflowY: 'auto',
                    '& .MuiTreeItem-root': {
                        '& .MuiTreeItem-content': {
                            padding: '4px 0'
                        }
                    }
                }}
            >
                {nodes.map(node => renderTree(node))}
            </TreeView>

            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <DialogTitle>
                    <Typography sx={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: '16px',
                        fontWeight: 500,
                        color: '#1a1b1d'
                    }}>
                        New Folder
                    </Typography>
                </DialogTitle>
                <DialogContent dividers>
                    <TextField
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        placeholder="Enter folder name"
                        variant="outlined"
                        fullWidth
                        sx={{
                            mt: 1,
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: '#374151'
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={createNewFolder}>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>

            <EditNameDialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                node={nodeToEdit}
                nodes={nodes}
                updateList={setNodes}
            />
        </div>
    );
}; 