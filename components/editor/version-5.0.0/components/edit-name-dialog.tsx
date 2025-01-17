import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    Typography
} from '@mui/material';
import { TreeNode } from './edits-panel';

interface EditNameDialogProps {
    open: boolean;
    onClose: () => void;
    node: {
        edit: TreeNode;
        isFolder: boolean;
    } | null;
    nodes: TreeNode[];
    updateList: (nodes: TreeNode[]) => void;
}

export const EditNameDialog = ({ open, onClose, node, nodes, updateList }: EditNameDialogProps) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const renameFolderEdit = (item: TreeNode, id: string, newName: string): TreeNode => {
        if (item.id === id) {
            return { ...item, name: newName };
        }
        if (item.children) {
            return {
                ...item,
                children: item.children.map((child: TreeNode) => renameFolderEdit(child, id, newName))
            };
        }
        return item;
    };

    const updateData = () => {
        if (nodes) {
            const newList = nodes.map((item) => {
                return renameFolderEdit(item, node?.edit.id || '', name);
            });
            updateList(newList);
        }
    };

    const handleSave = () => {
        // Here you would typically call your API
        // For now, just update the local state
        updateData();
        onClose();
    };

    useEffect(() => {
        if (node?.edit) setName(node.edit.name);
    }, [node]);

    useEffect(() => {
        setError(name.includes("#") ? "You cannot add # in name" : '');
    }, [name]);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                <Typography sx={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '16px',
                    fontWeight: 500,
                    color: '#1a1b1d'
                }}>
                    {node?.isFolder ? 'Folder Name' : 'Edit Name'}
                </Typography>
            </DialogTitle>
            <DialogContent dividers={true}>
                <TextField
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && !error) {
                            e.preventDefault();
                            handleSave();
                        }
                    }}
                    label=""
                    autoFocus
                    inputProps={{ 'aria-label': 'Without label' }}
                    placeholder="Name"
                    variant="outlined"
                    error={!!error}
                    helperText={error}
                    sx={{
                        borderRadius: '10px',
                        height: '80px',
                        width: '300px',
                        '& legend': { display: 'none' },
                        '& fieldset': { top: 0 }
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    variant="outlined"
                    onClick={handleSave}
                    disabled={!!error}
                >
                    Update
                </Button>
            </DialogActions>
        </Dialog>
    );
}; 