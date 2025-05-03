import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useObjectives } from '../../context/ObjectiveContext';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const UpdateObjectives = () => {
  const navigate = useNavigate();
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const { getObjectivesByMonth, updateObjective } = useObjectives();
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState(null);

  const filteredObjectives = getObjectivesByMonth(selectedMonth, selectedYear);

  const handleEdit = (objective) => {
    setEditingId(objective.id);
    setEditingData({ ...objective });
  };

  const handleSave = () => {
    if (editingData) {
      updateObjective(editingId, editingData);
      setEditingId(null);
      setEditingData(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingData(null);
  };

  const handleKeyResultChange = (krId, field, value) => {
    setEditingData(prev => ({
      ...prev,
      keyResults: prev.keyResults.map(kr =>
        kr.id === krId ? { ...kr, [field]: field === 'title' ? value : Number(value) } : kr
      )
    }));
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from(
    { length: 5 },
    (_, i) => currentDate.getFullYear() - 2 + i
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Month</InputLabel>
              <Select
                value={selectedMonth}
                label="Month"
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {months.map((month, index) => (
                  <MenuItem key={month} value={index}>
                    {month}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Year</InputLabel>
              <Select
                value={selectedYear}
                label="Year"
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button variant="outlined" onClick={() => navigate('/admin/dashboard')}>
              Back to Dashboard
            </Button>
          </Grid>
        </Grid>
      </Box>

      {filteredObjectives.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">
            No objectives found for {months[selectedMonth]} {selectedYear}
          </Typography>
        </Paper>
      ) : (
        filteredObjectives.map((objective) => (
          <Paper key={objective.id} sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              {editingId === objective.id ? (
                <>
                  <TextField
                    value={editingData.title}
                    onChange={(e) => setEditingData({ ...editingData, title: e.target.value })}
                    fullWidth
                    sx={{ mr: 2 }}
                  />
                  <Box>
                    <IconButton color="primary" onClick={handleSave}>
                      <SaveIcon />
                    </IconButton>
                    <IconButton color="error" onClick={handleCancel}>
                      <CancelIcon />
                    </IconButton>
                  </Box>
                </>
              ) : (
                <>
                  <Typography variant="h6">{objective.title}</Typography>
                  <IconButton color="primary" onClick={() => handleEdit(objective)}>
                    <EditIcon />
                  </IconButton>
                </>
              )}
            </Box>

            <Grid container spacing={2}>
              {(editingId === objective.id ? editingData : objective).keyResults.map((kr) => (
                <Grid item xs={12} key={kr.id}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          label="Key Result Title"
                          value={kr.title}
                          onChange={(e) => handleKeyResultChange(kr.id, 'title', e.target.value)}
                          fullWidth
                          disabled={editingId !== objective.id}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          label="Initial Value"
                          type="number"
                          value={kr.initialValue}
                          onChange={(e) => handleKeyResultChange(kr.id, 'initialValue', e.target.value)}
                          fullWidth
                          disabled={editingId !== objective.id}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          label="Target Value"
                          type="number"
                          value={kr.targetValue}
                          onChange={(e) => handleKeyResultChange(kr.id, 'targetValue', e.target.value)}
                          fullWidth
                          disabled={editingId !== objective.id}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          label="Current Value"
                          type="number"
                          value={kr.currentValue}
                          onChange={(e) => handleKeyResultChange(kr.id, 'currentValue', e.target.value)}
                          fullWidth
                          disabled={editingId !== objective.id}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Typography variant="body2" sx={{ mt: 2 }}>
                          Progress: {((kr.currentValue - kr.initialValue) / (kr.targetValue - kr.initialValue) * 100).toFixed(1)}%
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        ))
      )}
    </Container>
  );
};

export default UpdateObjectives;
