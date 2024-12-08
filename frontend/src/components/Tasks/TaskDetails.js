import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./Tasks.css";

const TaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      // Only fetch if taskId exists
      if (!id) {
        setError("No task ID provided");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await axios.get(`http://localhost:4000/api/tasks/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Ensure response.data exists and is not empty
        if (response.data) {
          setTask(response.data);
        } else {
          setError("No task data found");
        }
      } catch (err) {
        console.error("Error fetching task details:", err);
        setError(err.response?.data?.message || err.message || "Error fetching task details");
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [id]);

  // Render loading state
  if (loading) {
    return <div className="loading">Loading task details...</div>;
  }

  // Render error state
  if (error) {
    return <div className="error">{error}</div>;
  }

  // Render no task state
  if (!task) {
    return <div className="no-task">No task selected or found.</div>;
  }

  // Render task details
  return (
    <div className="task-details">
      <h2>Task Details</h2>
      <div className="task-info">
        <h3>{task.title}</h3>
        <p>{task.description}</p>
        <p>Priority: {task.priority}</p>
        <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default TaskDetails;