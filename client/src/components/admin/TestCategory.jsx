import { Button, Chip, Stack, TextField } from '@mui/material';
import React, { useRef, useState } from 'react';
import { deleteCategory, setCategory } from '../../redux/slices/admin';
import { MdOutlineDelete as DeleteIcon } from "react-icons/md";

const TestCategory = ({ dispatch, categories }) => {
    const [newCategory, setNewCategory] = useState('');

    const inputref = useRef(null)

    const handleAddCategory = () => {
        if (newCategory.trim()) {
            dispatch(setCategory(newCategory.trim()));
            setNewCategory('');
            inputref.current.focus();
        }
    };

    const handleDeleteCategory = (categoryToDelete) => {
        dispatch(deleteCategory(categoryToDelete));
    };

    return (
        <div>
            <Stack direction="row" spacing={2} sx={{ mb: 2, alignItems: 'center' }}>
                <TextField
                    label="Add Category"
                    variant="outlined"
                    size="small"
                    fullWidth
                    inputRef={inputref}
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                />
                <Button
                    variant="contained"
                    size="medium"
                    sx={{ bgcolor: '#286675' }}
                    onClick={handleAddCategory}
                >
                    Add
                </Button>
                <Button
                    variant="contained"
                    size="medium"

                    sx={{ bgcolor: '#286675', fontSize: '.7rem' }}
                    onClick={() => handleDeleteCategory("")}
                >
                    Delete All
                </Button>
            </Stack>

            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                {
                    categories?.map((category, index) => (
                        <Chip
                            key={index}
                            label={category}
                            onDelete={() => handleDeleteCategory(category)}
                            deleteIcon={<DeleteIcon style={{ color: 'white' }} />}
                            sx={{ bgcolor: '#286675', color: 'white' }}
                        />
                    ))
                }
            </Stack>
        </div>
    );
};

export default TestCategory;
