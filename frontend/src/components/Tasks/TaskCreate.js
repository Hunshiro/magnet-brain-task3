import React, { useState } from "react";
import { useTasks } from "../../context/TaskContext"; // Use useTasks hook
import "./Tasks.css";

const TaskCreate = () => {
  const { addTask } = useTasks(); // Access addTask from context
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState(""); // Error state for validation
  const [successMessage, setSuccessMessage] = useState(""); // Success message state
  const [isLoading, setIsLoading] = useState(false); // Loading state for button

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors
    setSuccessMessage(""); // Clear previous success messages

    // Validation
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }

    if (!dueDate) {
      setError("Due date is required.");
      return;
    }

    setIsLoading(true);

    try {
      await addTask({ title, description, priority, dueDate }); // Call addTask
      setSuccessMessage("Task created successfully!");
      // Reset the form
      setTitle("");
      setDescription("");
      setPriority("Medium");
      setDueDate("");
    } catch (err) {
      setError("Failed to create task. Please try again.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="task-create-container">
      <form onSubmit={handleSubmit} className="task-form">
        <h2>Create Task</h2>

        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <div className="form-group">
          <label>Task Title</label>
          <input
            type="text"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Task Description</label>
          <textarea
            placeholder="Enter task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="form-group">
          <label>Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={isLoading} className="submit-button">
          {isLoading ? "Adding Task..." : "Add Task"}
        </button>
      </form>
    </div>
  );
};

export default TaskCreate;
