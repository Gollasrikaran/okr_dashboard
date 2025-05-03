import React, { createContext, useState, useContext, useEffect } from 'react';

const STORAGE_KEY = 'okr_objectives';

const ObjectiveContext = createContext();

const getInitialObjectives = () => {
  const savedObjectives = localStorage.getItem(STORAGE_KEY);
  if (savedObjectives) {
    try {
      return JSON.parse(savedObjectives);
    } catch (error) {
      console.error('Error parsing objectives from localStorage:', error);
      return [];
    }
  }
  const currentDate = new Date();
  return [
    {
      id: '1',
      title: 'Sample Objective',
      month: currentDate.getMonth(),
      year: currentDate.getFullYear(),
      keyResults: [
        {
          id: '1',
          title: 'Sample Key Result',
          initialValue: 0,
          targetValue: 100,
          currentValue: 50
        }
      ]
    }
  ];
};

export const ObjectiveProvider = ({ children }) => {
  const [objectives, setObjectives] = useState(getInitialObjectives);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(objectives));
  }, [objectives]);

  const addObjective = (newObjective) => {
    setObjectives(prevObjectives => {
      const updatedObjectives = [...prevObjectives, {
        ...newObjective,
        id: Date.now().toString()
      }];
      return updatedObjectives;
    });
  };

  const updateObjective = (objectiveId, updatedData) => {
    setObjectives(prevObjectives => {
      const updatedObjectives = prevObjectives.map(obj => 
        obj.id === objectiveId ? { ...obj, ...updatedData } : obj
      );
      return updatedObjectives;
    });
  };

  const deleteObjective = (objectiveId) => {
    setObjectives(prevObjectives => 
      prevObjectives.filter(obj => obj.id !== objectiveId)
    );
  };

  const updateKeyResult = (objectiveId, keyResultId, updatedData) => {
    setObjectives(prevObjectives => {
      const updatedObjectives = prevObjectives.map(obj => {
        if (obj.id === objectiveId) {
          const updatedKeyResults = obj.keyResults.map(kr =>
            kr.id === keyResultId ? { ...kr, ...updatedData } : kr
          );
          return { ...obj, keyResults: updatedKeyResults };
        }
        return obj;
      });
      return updatedObjectives;
    });
  };

  const getObjectivesByMonth = (month, year) => {
    return objectives.filter(obj => obj.month === month && obj.year === year);
  };

  return (
    <ObjectiveContext.Provider value={{
      objectives,
      addObjective,
      updateObjective,
      deleteObjective,
      updateKeyResult,
      getObjectivesByMonth
    }}>
      {children}
    </ObjectiveContext.Provider>
  );
};

export const useObjectives = () => {
  const context = useContext(ObjectiveContext);
  if (!context) {
    throw new Error('useObjectives must be used within an ObjectiveProvider');
  }
  return context;
};
