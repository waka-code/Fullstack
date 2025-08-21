import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext';
import TaskList from './components/TaskList';


const App: React.FC = () => {
  return (
    <TaskProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={<TaskList />} />
        </Routes>
      </div>
    </TaskProvider>
  );
};

export default App;
