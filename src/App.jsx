import React, { useState, useEffect } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import { useFormik } from "formik";
// import Banner from "./Components/Banner";
import "./App.css";
// import NavbarType from "./Components/NavbarType";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import LoadingComp from "./components/LoadingComp";
import Banner from "./components/Banner";
// import LoadingComp from "./Components/LoadingComp";

function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const [visible, setVisible] = useState(false);

  const [todos, setTodos] = useState([]);
  const formik = useFormik({
    initialValues: {
      todo: "",
      todo2: "",
    },
    validate: (values) => {
      console.log(values);
      const errors = {};
      console.log(errors);

      if (!values.todo) {
        errors.todo = "Name field are requireds";
      } else if (values.todo.length < 4) {
        errors.todo = "lenght must be 3 characters";
      }

      if (!values.todo2) {
        errors.todo2 = "JobRoll field are requireds";
      } else if (values.todo2.length < 4) {
        errors.todo2 = "lenght must be 3 characters";
      }

      return errors;
    },

    onSubmit: (values) => {
      console.log(values);
      addTodo(values.todo, values.todo2);
      formik.resetForm();
      setVisible(false);
    },
  });

  // Ye hook todos ko localStorage se load karne ke liye hai jab component render ho
  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  // ADD TODO
  const addTodo = (data, data2) => {
    const todoObject = {
      id: Math.random(),
      text: data,
      text2: data2,
    };

    setTodos([...todos, todoObject]);
    localStorage.setItem("todos", JSON.stringify([...todos, todoObject]));
    setVisible(false);
  };

  // Delete TODO Fun
  const deleteTodo = (id) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  const [editVisible, setEditVisible] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);

  const openEditModal = (todo) => {
    setCurrentTodo(todo);
    setEditVisible(true);
  };

  const handleEditChange = (e, field) => {
    setCurrentTodo({ ...currentTodo, [field]: e.target.value });
  };

  // Update todo Fun
  const updateTodo = () => {
    const updatedTodos = todos.map((todo) =>
      todo.id === currentTodo.id ? currentTodo : todo
    );
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
    setEditVisible(false);
  };

  // Pagination
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(5);
  const [currentPageData, setCurrentPageData] = useState([]);

  const onPageChange = (e) => {
    setFirst(e.first);
    setRows(e.rows);
    const endIndex = e.first + e.rows;
    setCurrentPageData(todos.slice(e.first, endIndex));
  };

  // Ye effect pagination ke update ke sath todos ko sync karne ke liye hai
  useEffect(() => {
    const endIndex = first + rows;
    setCurrentPageData(todos.slice(first, endIndex));
  }, [todos, first, rows]);

  const template3 = {
    layout:
      "PrevPageLink PageLinks NextPageLink RowsPerPageDropdown CurrentPageReport",

    CurrentPageReport: (options) => {
      return (
        <span
          style={{
            color: "var(--text-color)",
            userSelect: "none",
            width: "120px",
            textAlign: "center",
          }}
        >
          {options.first} - {options.last} of {options.totalRecords}
        </span>
      );
    },
  };

  //serach filter

  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const columns = [
    { field: "text", header: "Name" },
    { field: "text2", header: "Job Roll" },
  ];

  return (
    <>
      <Banner />
      <div className="container">
        <div className="sidebar">
          <h2>Sidebar</h2>
          <p>This sidebar will stay sticky.</p>
          <p>This sidebar will stay sticky.</p>
        </div>
        <div className="main-content">
          {/* nav-banner-style-type */}

          <div>
            <div className="nav-banner-TypeStyle">
              <div className="nav-banner1">
                <div>
                  <i
                    className="pi pi-user"
                    style={{ fontSize: "1rem", padding: "5px" }}
                  ></i>
                  <span>People</span>
                </div>

                <div className="nav-banner2">
                  <div className="flex justify-content-end">
                    <div className="flex justify-content-end">
                      <IconField iconPosition="left">
                        <InputIcon className="pi pi-search" />
                        <InputText
                          value={globalFilterValue}
                          onChange={onGlobalFilterChange}
                          className="p-inputtext-sm"
                          placeholder="Search Anything"
                        />
                      </IconField>
                    </div>
                  </div>
                  <div>
                    <Button
                      onClick={() => setVisible(true)}
                      icon="pi pi-plus"
                      size="small"
                      label="People"
                    />
                  </div>
                  <div
                    className="pi pi-refresh"
                    style={{ fontSize: "1.5rem", color: "blue" }}
                    onClick={() => window.location.reload()}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar for adding new todos */}
          <div className="card flex justify-content-center">
            <Sidebar
              visible={visible}
              position="right"
              onHide={() => setVisible(false)}
            >
              <h2>Todo App</h2>
              <form onSubmit={formik.handleSubmit}>
                <InputText
                  className="margin-top input-todo-button"
                  type="text"
                  placeholder="Enter your Name"
                  name="todo"
                  value={formik.values.todo}
                  onChange={formik.handleChange}
                />
                {formik.errors.todo && (
                  <div style={{ color: "red", marginBlock: "5px" }}>
                    {formik.errors.todo}
                  </div>
                )}
                <InputText
                  className="margin-top input-todo-button"
                  type="text"
                  placeholder="Enter Job Roll"
                  name="todo2"
                  value={formik.values.todo2}
                  onChange={formik.handleChange}
                />

                {formik.errors.todo2 && (
                  <div style={{ color: "red", marginBlock: "5px" }}>
                    {formik.errors.todo2}
                  </div>
                )}

                <Button
                  className="add-todo-button"
                  type="submit"
                  label="Add Todo"
                />
              </form>
            </Sidebar>
          </div>

          {/* Edit modal */}
          <Sidebar visible={editVisible} onHide={() => setEditVisible(false)}>
            <h2>Edit Todo</h2>
            <InputText
              type="text"
              className="margin-top input-todo-button"
              placeholder="Update Name"
              value={currentTodo?.text || ""}
              onChange={(e) => handleEditChange(e, "text")}
            />
            <InputText
              type="text"
              className="margin-top input-todo-button"
              placeholder="Update Job Roll"
              value={currentTodo?.text2 || ""}
              onChange={(e) => handleEditChange(e, "text2")}
            />
            <Button
              className="add-update-button"
              onClick={updateTodo}
              label="Update Todo"
            />
          </Sidebar>

          {/* Table with Pagination */}

          <div className=" table">
            {loading ? (
              <LoadingComp />
            ) : (
              <>
                <DataTable
                  // className="data-table"
                  style={{
                    // border: "1px solid blue",
                    width: "100%",
                    textAlign: "center",
                    marginTop:"6px"
                  }}
                
                  scrollHeight="400px"
                  value={currentPageData}
                  globalFilterFields={["text", "text2"]}
                  filters={filters}
                >
                  {columns.map((col) => (
                    <Column
                      style={{  width: "33%" }}
                      key={col.field}
                      field={col.field}
                      header={col.header}
                      sortable
                    />
                  ))}
                  <Column
                    header="Actions"
                    // style={{ border: "1px solid green" }}
                    body={(rowData) => (
                      <div
                      >
                        <Button
                          label="Edit"
                          icon="pi pi-pencil"
                          className="p-button-text p-button-warning"
                          onClick={() => openEditModal(rowData)}
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
              </>
            )}

            <div className="pagination">
              <Paginator
                // style={{ width: "80%", maxWidth: "1200px" }}
                first={first}
                rows={rows}
                totalRecords={todos.length}
                rowsPerPageOptions={[5, 10]}
                onPageChange={onPageChange}
                template={template3}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
