import { Button, Chip, Stack, TextField } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { MdOutlineDeleteOutline as DeleteIcon } from "react-icons/md";
import { setCategory } from '../../redux/slices/admin';

const TestCategory = ({ dispatch, categories }) => {
    const [newCategory, setNewCategory] = useState('');
    const inputRef = useRef(null);

    const handleAddCategory = () => {
        if (newCategory.trim() && !categories.includes(newCategory.trim())) {
            dispatch(setCategory([...categories, newCategory.trim()]));
            setNewCategory('');
        }
    };

    const handleDeleteCategory = (categoryToDelete) => {
        dispatch(setCategory(categories.filter(category => category !== categoryToDelete)));
    };

    // key press 
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === '/') {
                inputRef.current?.focus();
            } else if (event.key === 'Escape') {
                inputRef.current?.blur();
            }
        }
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <div onKeyDown={(e) => { if (e.key === '/') ref.focus() }}>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <TextField
                    label="Add Category"
                    variant="outlined"
                    size="small"
                    fullWidth
                    inputRef={inputRef}
                    value={newCategory}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddCategory() }}
                    onChange={(e) => setNewCategory(e.target.value)}
                />
                <Button
                    variant="contained"
                    size="medium"
                    sx={{ bgcolor: '#286675' }}
                    onClick={handleAddCategory}
                >
                    Add
                </Button>
            </Stack>

            <Stack direction="row" spacing={1} flexWrap="wrap">
                {categories?.map((category, index) => (
                    <Chip
                        key={index}
                        label={category}
                        deleteIcon={<DeleteIcon />}
                        onDelete={() => handleDeleteCategory(category)}
                        sx={{
                            mb: 1,
                            transition: '0.3s',
                            '&:hover .MuiChip-deleteIcon': {
                                color: '#ff0000',
                            },
                        }}
                    />
                ))}
            </Stack>
        </div>
    );
};

export default TestCategory;
