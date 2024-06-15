import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, Grid, IconButton } from '@mui/material';
import { DeleteForever } from '@mui/icons-material';

const AdditionalInfo = ({ inventory, onSave, onCancel }) => {
  const [additionalInfo, setAdditionalInfo] = useState({
    extraNote: '',
    disclaimer: '',
    careInstructions: []
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (inventory) {
      setAdditionalInfo({
        extraNote: inventory.extraNote || '',
        disclaimer: inventory.disclaimer || '',
        careInstructions: inventory.careInstructions || []
      });
    }
  }, [inventory]);

  const [newCareInstruction, setNewCareInstruction] = useState('');

  const handleAddCareInstruction = () => {
    if (newCareInstruction.trim() !== '') {
      setAdditionalInfo((prev) => ({
        ...prev,
        careInstructions: [...prev.careInstructions, newCareInstruction.trim()],
      }));
      setNewCareInstruction('');
    }
  };

  const handleRemoveCareInstruction = (index) => {
    const updatedCareInstructions = additionalInfo.careInstructions.filter((_, i) => i !== index);
    setAdditionalInfo({
      ...additionalInfo,
      careInstructions: updatedCareInstructions,
    });
  };

  const handleChange = (e, field) => {
    setAdditionalInfo({
      ...additionalInfo,
      [field]: e.target.value,
    });
  };

  const handleSave = () => {
    onSave(additionalInfo);
    setEditMode(false);
  };

  const handleCancel = () => {
    onCancel();
    setEditMode(false);
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  return (
    <Grid container spacing={2}>
      {editMode ? (
        <>
          <Grid item xs={12}>
            <TextField
              label="Extra Note"
              value={additionalInfo.extraNote}
              onChange={(e) => handleChange(e, 'extraNote')}
              fullWidth
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Disclaimer"
              value={additionalInfo.disclaimer}
              onChange={(e) => handleChange(e, 'disclaimer')}
              fullWidth
              variant="outlined"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Care Instructions:</Typography>
            {additionalInfo.careInstructions.map((instruction, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginLeft: '10%' }}>
                <Typography>{instruction}</Typography>
                <IconButton onClick={() => handleRemoveCareInstruction(index)} color="secondary">
                  <DeleteForever />
                </IconButton>
              </div>
            ))}
            <TextField
              label="Add New Care Instruction"
              value={newCareInstruction}
              onChange={(e) => setNewCareInstruction(e.target.value)}
              fullWidth
              variant="outlined"
              margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleAddCareInstruction} sx={{ mt: 1 }}>
              Add Care Instruction
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleSave} sx={{ mr: 2 }}>
              Save
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </Grid>
        </>
      ) : (
        <>
          <Grid item xs={12}>
            <Typography><strong>Extra Note:</strong> {inventory.extraNote}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Disclaimer:</strong> {inventory.disclaimer}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Care Instructions:</strong></Typography>
            {inventory.careInstructions.map((instruction, index) => (
              <Typography style={{ marginLeft: "10%" }} key={index}>{instruction}</Typography>
            ))}
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleEditToggle}>
              Edit
            </Button>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default AdditionalInfo;
