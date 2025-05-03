import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useObjectives } from '../../context/ObjectiveContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const { objectives, deleteObjective, getObjectivesByMonth } = useObjectives();

  const filteredObjectives = getObjectivesByMonth(selectedMonth, selectedYear);

  const calculateProgress = (keyResult) => {
    const progress = ((keyResult.currentValue - keyResult.initialValue) / 
                     (keyResult.targetValue - keyResult.initialValue)) * 100;
    return Math.min(Math.max(0, progress), 100);
  };

  const calculateOverallProgress = (objective) => {
    if (objective.keyResults.length === 0) return 0;
    const totalProgress = objective.keyResults.reduce(
      (sum, kr) => sum + calculateProgress(kr),
      0
    );
    return totalProgress / objective.keyResults.length;
  };

  const calculateTotalProgress = () => {
    if (filteredObjectives.length === 0) return 0;
    const totalProgress = filteredObjectives.reduce(
      (sum, obj) => sum + calculateOverallProgress(obj),
      0
    );
    return totalProgress / filteredObjectives.length;
  };

  const getProgressColor = (progress) => {
    if (progress >= 75) return '#4caf50'; // Green
    if (progress >= 50) return '#ff9800'; // Orange
    return '#f44336'; // Red
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from(
    { length: 5 },
    (_, i) => currentDate.getFullYear() - 2 + i
  );

  const handleCreateObjective = () => {
    navigate('/admin/create-objective');
  };

  const handleUpdateObjectives = () => {
    navigate('/admin/update-objectives');
  };

  const handleDeleteObjective = (objectiveId) => {
    if (window.confirm('Are you sure you want to delete this objective?')) {
      deleteObjective(objectiveId);
    }
  };

  const totalProgress = calculateTotalProgress();

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
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
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleCreateObjective}
            >
              Create New Objective
            </Button>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={handleUpdateObjectives}
            >
              Update Objectives
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {/* Main content - Objectives list */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {filteredObjectives.map((objective) => (
              <Grid item xs={12} key={objective.id}>
                <Paper
                  sx={{
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">
                      {objective.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="h6">
                        {calculateOverallProgress(objective).toFixed(1)}%
                      </Typography>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteObjective(objective.id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  {objective.keyResults.map((kr) => (
                    <Box
                      key={kr.id}
                      sx={{
                        mt: 2,
                        p: 2,
                        bgcolor: 'background.default',
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="subtitle1">{kr.title}</Typography>
                      <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={3}>
                          <Typography variant="body2">
                            Initial: {kr.initialValue}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Typography variant="body2">
                            Target: {kr.targetValue}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Typography variant="body2">
                            Current: {kr.currentValue}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Typography variant="body2">
                            Progress: {calculateProgress(kr).toFixed(1)}%
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Right sidebar - Summary card */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              position: 'sticky',
              top: 24,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              height: 'fit-content',
              backgroundColor: '#ffffff',
              boxShadow: 3
            }}
          >
            <Typography variant="h6" gutterBottom>
              Overall Progress
            </Typography>
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress
                variant="determinate"
                value={totalProgress}
                size={120}
                thickness={4}
                sx={{
                  color: getProgressColor(totalProgress)
                }}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  variant="h4"
                  component="div"
                  sx={{ color: getProgressColor(totalProgress) }}
                >
                  {totalProgress.toFixed(1)}%
                </Typography>
              </Box>
            </Box>
            <Box sx={{ mt: 2, width: '100%' }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Summary
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2">
                  Total Objectives: {filteredObjectives.length}
                </Typography>
                <Typography variant="body2">
                  Total Key Results: {filteredObjectives.reduce((sum, obj) => sum + obj.keyResults.length, 0)}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: getProgressColor(totalProgress),
                    fontWeight: 'bold',
                    mt: 1,
                    p: 1,
                    borderRadius: 1,
                    backgroundColor: (theme) => theme.palette.grey[100]
                  }}
                >
                  Status: {totalProgress >= 75 ? 'On Track' : totalProgress >= 50 ? 'At Risk' : 'Behind'}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
