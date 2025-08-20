import React from 'react';
import { TaskProvider } from './context/TaskContext';
import TaskList from './components/TaskList';

const App: React.FC = () => {
  return (
    <TaskProvider>
      <div className="App">
        <TaskList />
      </div>
    </TaskProvider>
  );
};

export default App;
