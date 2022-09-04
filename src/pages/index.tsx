import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import TodoCard from "../components/TodoCard/TodoCard";
import AddTodoForm from "../components/AddTodoForm";
import { useState } from "react";

// const TodoArray: Array<Todo> = [
//   { description: "Do chores", isComplete: false },
//   { description: "Eat food", isComplete: false },
//   { description: "Watch TV", isComplete: false },
//   { description: "Drink stuff", isComplete: false },
//   { description: "Destroy cars", isComplete: false },
//   { description: "Have Fun", isComplete: false },
//   { description: "Fail and then succeed", isComplete: false },
// ];

const Home: NextPage = () => {
  // const TodoArray =  ?? [];
  // console.log(TodoArray);

  const utils = trpc.useContext();
  const todosQuery = trpc.useQuery(["todo.getAll"]);

  const setIsComplete = trpc.useMutation("todo.setIsComplete", {
    async onSuccess() {
      await utils.invalidateQueries(["todo.getAll"]);
    },
  });
  const deleteTodoQuery = trpc.useMutation("todo.delete", {
    async onSuccess() {
      await utils.invalidateQueries(["todo.getAll"]);
    },
  });

  // console.log("todos data is", todosQuery.data);
  // const [todos, setTodos] = useState(todosData ? [...todosData] : []);
  const [currentLine, setCurrentLine] = useState(-1);

  const toggleTodo = (atIndex: number, newValue: boolean) => {
    setIsComplete.mutate({
      id: atIndex,
      isComplete: newValue,
    });
    console.log("toggled todo");
  };

  const deleteTodo = (atIndex: number) => {
    deleteTodoQuery.mutate({ id: atIndex });
    console.log("deleted todo");
  };

  return (
    <main
      className="container mx-auto flex select-none flex-col items-center justify-center min-h-screen"
      onDragEnd={() => setCurrentLine(-1)}
    >
      {todosQuery.data && (
        <>
          {todosQuery.data
            .sort((t1, t2) => t1.pos - t2.pos)
            .map((todoItem, index) => {
              return (
                <>
                  <div
                    className="w-96 h-6 flex justify-center items-center  hover:border-red-600 motion-safe:hover:scale-105"
                    onDragEnter={() => setCurrentLine(index)}
                  >
                    <div
                      className={`w-64 h-px motion-safe:hover:scale-105  ${
                        currentLine === index ? "bg-red-500" : "bg-slate-300"
                      }`}
                    ></div>
                  </div>
                  <TodoCard
                    todo={todoItem}
                    key={todoItem.id}
                    handleToggle={() => {
                      toggleTodo(todoItem.id, !todoItem.isComplete);
                    }}
                    handleDelete={() => {
                      deleteTodo(todoItem.id);
                    }}
                  />
                </>
                // </div>
              );
            })}
        </>
      )}

      {todosQuery.data && (
        <div
          className="w-96 h-6 flex justify-center items-center  hover:border-red-600 motion-safe:hover:scale-105"
          onDragEnter={() => setCurrentLine(todosQuery.data.length)}
        >
          <div
            className={`w-64 h-px motion-safe:hover:scale-105  ${
              currentLine === todosQuery.data.length
                ? "bg-red-500"
                : "bg-slate-300"
            }`}
          ></div>
        </div>
      )}
      <AddTodoForm />
    </main>
  );
};

export default Home;
