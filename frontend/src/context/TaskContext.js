import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No token found. Please login.");
      }
      
      const response = await axios.get('http://localhost:4000/api/tasks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Add a new task to the backend
  const addTask = async (taskData) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No token found. Please login.");
      }

      console.log("Task Data:", taskData); // Log the data being sent

      const response = await axios.post(
        "http://localhost:4000/api/tasks",
        taskData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks((prevTasks) => [...prevTasks, response.data]);
    } catch (error) {
      console.error("Error adding task:", error);
      throw error; // Re-throw error for component to handle
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, fetchTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

// Custom hook to use TaskContext
export const useTasks = () => useContext(TaskContext);

export default TaskContext;
