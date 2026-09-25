import { useEffect, useState } from "react";

const STORAGE_KEY = "todo-items";

export default function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  function addTodo(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    setTodos([{ id: Date.now(), text: trimmed, done: false }, ...todos]);
    setText("");
  }

  function toggleTodo(id) {
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function deleteTodo(id) {
    setTodos(todos.filter((t) => t.id !== id));
  }

  function clearCompleted() {
    setTodos(todos.filter((t) => !t.done));
  }

  const visible = todos.filter((t) => {
    if (filter === "active") return !t.done;
    if (filter === "done") return t.done;
    return true;
  });

  const remaining = todos.filter((t) => !t.done).length;

  return (
    <div className="container">
      <h1>My To-Do List</h1>

      <form className="add-form" onSubmit={addTodo}>
        <input
          type="text"
          placeholder="What needs to be done?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <div className="filters">
        {["all", "active", "done"].map((f) => (
          <button
            key={f}
            className={filter === f ? "filter active-filter" : "filter"}
            onClick={() => setFilter(f)}
          >
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <ul className="todo-list">
        {visible.length === 0 && <li className="empty">No tasks here.</li>}
        {visible.map((todo) => (
          <li key={todo.id} className={todo.done ? "todo done" : "todo"}>
            <label>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
              />
              <span>{todo.text}</span>
            </label>
            <button className="delete" onClick={() => deleteTodo(todo.id)} aria-label="Delete">
              ✕
            </button>
          </li>
        ))}
      </ul>

      <footer className="footer">
        <span>{remaining} item{remaining !== 1 ? "s" : ""} left</span>
        <button onClick={clearCompleted}>Clear completed</button>
      </footer>
    </div>
  );
}
