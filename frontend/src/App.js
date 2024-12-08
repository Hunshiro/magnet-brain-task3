import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import { TaskProvider } from './context/TaskContext.js';

// Import components
import Login from './components/Auth/Login.js';
import Register from './components/Auth/Register.js';
import Dashboard from './components/Dashboard/Dashboard.js';
import Taskcreate from './components/Tasks/TaskCreate.js';
import TaskList from './components/Tasks/TaskList.js';
import TaskDetails from './components/Tasks/TaskDetails';
import TaskEdit from './components/Tasks/TaskEdit';
import Navbar from './components/Layout/Navbar';
import PrivateRoute from './utils/PrivateRoute.js';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <Router>
          <div className="app-container">
            <Navbar /> {/* Add Navbar here */}
            <div className="main-content">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Private Routes */}
                <Route 
                  path="/" 
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/tasks" 
                  element={
                    <PrivateRoute>
                      <TaskList />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/tasks/create" 
                  element={
                    <PrivateRoute>
                      <Taskcreate />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/tasks/:id" 
                  element={
                    <PrivateRoute>
                      <TaskDetails />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/tasks/edit/:id" 
                  element={
                    <PrivateRoute>
                      <TaskEdit />
                    </PrivateRoute>
                  } 
                />
              </Routes>
            </div>
          </div>
        </Router>
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;