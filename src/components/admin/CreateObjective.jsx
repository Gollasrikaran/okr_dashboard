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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useObjectives } from '../../context/ObjectiveContext';

const CreateObjective = () => {
  const navigate = useNavigate();
  const { addObjective } = useObjectives();
  const currentDate = new Date();

  const [objective, setObjective] = useState({
    title: '',
    month: currentDate.getMonth(),
    year: currentDate.getFullYear(),
    keyResults: [
      {
        id: '1',
        title: '',
        initialValue: 0,
        targetValue: 0,
        currentValue: 0,
      },
    ],
  });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from(
    { length: 5 },
    (_, i) => currentDate.getFullYear() - 2 + i
  );

  const handleKeyResultChange = (id, field, value) => {
    setObjective(prev => ({
      ...prev,
      keyResults: prev.keyResults.map(kr =>
        kr.id === id
          ? {
              ...kr,
              [field]: field === 'title' ? value : Number(value),
            }
          : kr
      ),
    }));
  };

  const addKeyResult = () => {
    setObjective(prev => ({
      ...prev,
      keyResults: [
        ...prev.keyResults,
        {
          id: String(Date.now()),
          title: '',
          initialValue: 0,
          targetValue: 0,
          currentValue: 0,
        },
      ],
    }));
  };

  const removeKeyResult = (id) => {
    if (objective.keyResults.length > 1) {
      setObjective(prev => ({
        ...prev,
        keyResults: prev.keyResults.filter(kr => kr.id !== id),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!objective.title || objective.keyResults.some(kr => !kr.title)) {
      alert('Please fill in all required fields');
      return;
    }
    addObjective(objective);
    navigate('/admin/dashboard');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Create New Objective
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Objective"
                value={objective.title}
                onChange={(e) =>
                  setObjective(prev => ({ ...prev, title: e.target.value }))
                }
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Month</InputLabel>
                <Select
                  value={objective.month}
                  label="Month"
                  onChange={(e) => setObjective(prev => ({ ...prev, month: e.target.value }))}
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
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Year</InputLabel>
                <Select
                  value={objective.year}
                  label="Year"
                  onChange={(e) => setObjective(prev => ({ ...prev, year: e.target.value }))}
                >
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Key Results
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Initial Value</TableCell>
                <TableCell>Target Value</TableCell>
                <TableCell>Current Value</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {objective.keyResults.map((kr) => (
                <TableRow key={kr.id}>
                  <TableCell>
                    <TextField
                      fullWidth
                      value={kr.title}
                      onChange={(e) =>
                        handleKeyResultChange(kr.id, 'title', e.target.value)
                      }
                      required
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={kr.initialValue}
                      onChange={(e) =>
                        handleKeyResultChange(kr.id, 'initialValue', e.target.value)
                      }
                      required
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={kr.targetValue}
                      onChange={(e) =>
                        handleKeyResultChange(kr.id, 'targetValue', e.target.value)
                      }
                      required
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={kr.currentValue}
                      onChange={(e) =>
                        handleKeyResultChange(kr.id, 'currentValue', e.target.value)
                      }
                      required
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => removeKeyResult(kr.id)}
                      disabled={objective.keyResults.length === 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button type="button" onClick={addKeyResult}>
              Add Key Result
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!objective.title || objective.keyResults.some((kr) => !kr.title)}
            >
              Save Objective
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={() => navigate('/admin/dashboard')}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateObjective;
