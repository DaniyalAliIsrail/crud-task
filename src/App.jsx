import React, { useEffect, useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import "./App.css";
function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState(
    localStorage.getItem("todos")
      ? JSON.parse(localStorage.getItem("todos"))
      : []
  );
  const [dialogVisible, setDialogVisible] = useState(false); // Dialog dikhane ke liye state
  const [selectedTodo, setSelectedTodo] = useState(null); // Jo todo update karna ho wo store karne ke liye
  const [updatedText, setUpdatedText] = useState(""); // Updated text ke liye state
  // Sidebar visibility state
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Component render hone pe local storage se todos load karna
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  const addTodo = (data) => {
    console.log(data);
    const todoObject = {
      id: Math.random(),
      text: data,
    };
    setTodos([...todos, todoObject]);
    localStorage.setItem("todos", JSON.stringify([...todos, todoObject]));
    setTodo("");
  };

  const deleteTodo = (id) => {
    console.log(id);
    let newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  const openUpdateDialog = (todo) => {
    // Dialog kholne ka function jab update button click ho
    setSelectedTodo(todo);
    setUpdatedText(todo.text);
    setDialogVisible(true);
  };

  const handleUpdate = () => {
    // Update button pe click hone pe value update karne ka function
    const updatedTodos = todos.map((item) =>
      item.id === selectedTodo.id ? { ...item, text: updatedText } : item
    );
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
    setDialogVisible(false);
    setSelectedTodo(null);
  };

  // table content
  const columns = [{ field: "text", header: "Todos" }];

  return (
    <>
      <div className="card flex justify-content-center">
        {/* Dialog component for updating todo */}
        <Dialog
          header="Update Todo"
          visible={dialogVisible}
          style={{ width: "40vw" }}
          onHide={() => setDialogVisible(false)}
        >
          <div className="updatemodal">
            <InputText
              type="text"
              placeholder="Update your todo"
              value={updatedText}
              onChange={(e) => setUpdatedText(e.target.value)} // Input change handle karna
            />
            <Button label="Update" onClick={handleUpdate} className="mt-2" />
          </div>
        </Dialog>
      </div>

      {/* sidebar */}
      <div className="card flex justify-content-center">
        <Sidebar visible={visible} onHide={() => setVisible(false)}>
          <h2>Todo App</h2>
          <div className="card flex justify-content-center">
            <label className="input-margin" htmlFor="username">
              Todo
            </label>
            <InputText
              className="margin-top input-todo-button"
              type="text"
              placeholder="Enter your Todo"
              value={todo}
              onChange={(e) => setTodo(e.target.value)}
            />
            <Button
              className="margin-top add-todo-button"
              onClick={() => addTodo(todo)}
              label="Add Todo"
            />
          </div>
        </Sidebar>
        <Button icon="pi pi-arrow-right" onClick={() => setVisible(true)} />
      </div>

      {/* table */}

      <div className="card table">
        <DataTable value={todos} tableStyle={{ minWidth: "50rem" }}>
          {/* Table columns dynamically map karna */}
          {columns.map((col) => (
            <Column key={col.field} field={col.field} header={col.header} />
          ))}
          {/* Action buttons ke liye column */}
          <Column
            header="Actions"
            body={(rowData) => (
              <div>
                {/* Edit button */}
                <Button
                  label="Edit"
                  icon="pi pi-pencil"
                  className="p-button-text p-button-warning"
                  onClick={() => openUpdateDialog(rowData)} //update fun
                />
                {/* Delete button */}
                <Button
                  label="Delete"
                  icon="pi pi-trash"
                  className="p-button-text p-button-danger"
                  onClick={() => deleteTodo(rowData.id)} //del fun
                />
              </div>
            )}
          />
        </DataTable>
      </div>
    </>
  );
}

export default App;
