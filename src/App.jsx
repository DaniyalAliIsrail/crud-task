import React, { useEffect, useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import "./App.css";
function App() {
  // Sidebar visibility state
  const [visible, setVisible] = useState(false);

  const [todo, setTodo] = useState("");
  const [todo2, setTodo2] = useState("");
  const [todos, setTodos] = useState(
    localStorage.getItem("todos")
      ? JSON.parse(localStorage.getItem("todos"))
      : []
  );

  const addTodo = (data, data2) => {
    console.log(data2);
    const todoObject = {
      id: Math.random(),
      text: data,
      text2: data2,
    };

    setTodos([...todos, todoObject]);
    localStorage.setItem("todos", JSON.stringify([...todos, todoObject]));
    setTodo("");
    setTodo2("");
  };

  const [dialogVisible, setDialogVisible] = useState(false); // Dialog dikhane ke liye state
  const [selectedTodo, setSelectedTodo] = useState(null); //Jotodo update karna howo store karnek liye
  const [updatedText, setUpdatedText] = useState(""); // Updated text ke liye state
  const [updatedText2, setUpdatedText2] = useState("");

  useEffect(() => {
    // Component render hone pe local storage se todos load karna
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

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
    setUpdatedText2(todo.text2);
    setDialogVisible(true);
  };

  const handleUpdate = () => {
    // Update function jab update button pe click ho
    const updatedTodos = todos.map((item) =>
      item.id === selectedTodo.id
        ? { ...item, text: updatedText, text2: updatedText2 }
        : item
    );
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
    setDialogVisible(false); // Dialog close karna
    setSelectedTodo(null); // Selected todo clear karna
  };

  // table content
  const columns = [
    { field: "text", header: "Todos" },
    { field: "text2", header: "Todos2" },
  ];

  return (
    <>
      <div className="card flex justify-content-center">
      {/* open modal */}
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
              onChange={(e) => setUpdatedText(e.target.value)} // 
            />
            <InputText
              type="text"
              placeholder="Update your todo2"
              value={updatedText2}
              onChange={(e) => setUpdatedText2(e.target.value)}
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
            {/* <label className="input-margin" htmlFor="username">
              Todo
            </label> */}

            <InputText
              className="margin-top input-todo-button"
              type="text"
              placeholder="Enter your Todo"
              value={todo}
              onChange={(e) => setTodo(e.target.value)}
            />
            <InputText
              className="margin-top input-todo-button"
              type="text"
              value={todo2}
              placeholder="Enter your Todo2"
              onChange={(e) => setTodo2(e.target.value)}
            />
            <Button
              className="margin-top add-todo-button"
              onClick={() => addTodo(todo, todo2)}
              label="Add Todo"
            />
          </div>
        </Sidebar>
        <div className="plus-btn">
        <Button icon="pi pi-plus" onClick={() => setVisible(true)} />
      </div>
      </div>

      {/* table */}

      <div className="card table">
        <DataTable value={todos} tableStyle={{ minWidth: "50rem" }}>
          {columns.map((col) => (
            <Column key={col.field} field={col.field} header={col.header} />
          ))}
          <Column
            header="Actions"
            body={(rowData) => (
              <div>
                <Button
                  label="Edit"
                  icon="pi pi-pencil"
                  className="p-button-text p-button-warning"
                  onClick={() => openUpdateDialog(rowData)}
                />
                <Button
                  label="Delete"
                  icon="pi pi-trash"
                  className="p-button-text p-button-danger"
                  onClick={() => deleteTodo(rowData.id)}
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
