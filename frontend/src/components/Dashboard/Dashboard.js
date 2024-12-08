import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { tasks, fetchTasks } = useTasks();
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    highPriority: 0
  });
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    if (fetchTasks) {
      fetchTasks();
    }
  }, [fetchTasks]);

  useEffect(() => {
    // Ensure tasks is an array before reducing
    const tasksArray = Array.isArray(tasks) ? tasks : [];
    
    // Calculate task statistics
    const stats = tasksArray.reduce((acc, task) => {
      acc.total++;
      if (task.status === 'completed') {
        acc.completed++;
      } else {
        acc.pending++;
      }
      if (task.priority === 'high') {
        acc.highPriority++;
      }
      return acc;
    }, { total: 0, completed: 0, pending: 0, highPriority: 0 });

    setTaskStats(stats);
  }, [tasks]);

  // Function to handle status change
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:4000/api/tasks/status/${taskId}`, 
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Refetch tasks to update the list
      if (fetchTasks) {
        fetchTasks();
      }
      // Close the dropdown
      setSelectedTask(null);
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Failed to update task status');
    }
  };

  // Render status dropdown
  const renderStatusDropdown = (task) => {
    const statuses = [
      { value: 'pending', label: 'Pending' },
      { value: 'in-progress', label: 'In Progress' },
      { value: 'completed', label: 'Completed' }
    ];

    return (
      <div className="status-dropdown-container">
        <button 
          className="status-dropdown-trigger"
          onClick={() => setSelectedTask(selectedTask === task._id ? null : task._id)}
        >
          Change Status <i className="fas fa-chevron-down"></i>
        </button>
        {selectedTask === task._id && (
          <div className="status-dropdown-menu">
            {statuses.map(status => (
              <button
                key={status.value}
                className={`status-dropdown-item ${status.value === task.status ? 'active' : ''}`}
                onClick={() => handleStatusChange(task._id, status.value)}
              >
                {status.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name || 'User'}!</h1>
        <p>Here's an overview of your tasks</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card total-tasks">
          <h3>Total Tasks</h3>
          <div className="stat-number">{taskStats.total}</div>
        </div>
        <div className="stat-card completed-tasks">
          <h3>Completed Tasks</h3>
          <div className="stat-number">{taskStats.completed}</div>
        </div>
        <div className="stat-card pending-tasks">
          <h3>Pending Tasks</h3>
          <div className="stat-number">{taskStats.pending}</div>
        </div>
        <div className="stat-card high-priority">
          <h3>High Priority</h3>
          <div className="stat-number">{taskStats.highPriority}</div>
        </div>
      </div>

      <div className="dashboard-quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/tasks/create" className="action-button create-task">
            <i className="fas fa-plus"></i> Create New Task
          </Link>
          <Link to="/tasks" className="action-button view-tasks">
            <i className="fas fa-list"></i> View All Tasks
          </Link>
        </div>
      </div>

      <div className="recent-tasks">
        <h2>Recent Tasks</h2>
        {tasks && tasks.length > 0 ? (
          tasks.slice(0, 5).map(task => (
            <div key={task._id} className="recent-task-item">
              <div className="task-info">
                <div className="task-header">
                  <h4>{task.title}</h4>
                  <span className={`task-status ${task.status}`}>
                    {task.status}
                  </span>
                </div>
                
                <div className="task-actions">
                  {renderStatusDropdown(task)}
                </div>
              </div>
              <div className="task-details">
                <p>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</p>
                <Link to={`/tasks/${task._id}`} className="view-task-link">
                  View Details
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="no-tasks-message">
            No recent tasks. <Link to="/tasks/create">Create a new task</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;