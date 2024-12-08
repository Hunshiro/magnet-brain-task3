import React from "react";
import { useTasks } from "../../context/TaskContext"; // Use useTasks instead of TaskContext
import "./Tasks.css";

const TaskList = () => {
  const { tasks, removeTask } = useTasks(); // Access tasks via the hook

  return (
    <div className="task-list">
      <h2>All Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks available. Create one!</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id} className={`task-item ${task.priority.toLowerCase()}`}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Priority: {task.priority}</p>
              <p>Due Date: {task.dueDate}</p>
              <button onClick={() => removeTask(task.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
