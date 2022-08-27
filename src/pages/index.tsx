import { Todo } from "@prisma/client";
import type { NextPage } from "next";
import Head from "next/head";
import { MouseEvent, useState } from "react";
import { trpc } from "../utils/trpc";

type TodoCardProps = {
  todo: Todo;
  // handleClick: Function;
};

// const TodoArray: Array<Todo> = [
//   { description: "Do chores", isComplete: false },
//   { description: "Eat shit", isComplete: false },
//   { description: "Watch TV", isComplete: false },
//   { description: "Drink METH", isComplete: false },
//   { description: "Destroy cars", isComplete: false },
//   { description: "Have Fun", isComplete: false },
//   { description: "Fail", isComplete: false },
// ];

const Home: NextPage = () => {
  // const TodoArray =  ?? [];
  // console.log(TodoArray);
  const todosQuery = trpc.useQuery(["todo.getAll"]);
  console.log("todos data is", todosQuery.data);
  // const [todos, setTodos] = useState(todosData ? [...todosData] : []);

  // const toggleTodo = (atIndex: number) => {
  //   setTodos(
  //     todos!.map((todo, index) =>
  //       // Here you accept a id argument to the function and replace it with hard coded 🤪 2, to make it dynamic.
  //       index === atIndex - 1
  //         ? { ...todo, isComplete: !todo.isComplete }
  //         : { ...todo }
  //     )
  //   );
  // };

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex select-none flex-col gap-2 items-center justify-center min-h-screen p-4">
        {todosQuery.data ? (
          todosQuery.data.map((todoItem) => {
            return (
              // <div onClick={() => toggleTodo(index)}>
              <TodoCard
                todo={todoItem}
                key={todoItem.id}
                // handleClick={() => toggleTodo(todoItem.id)}
              />
              // </div>
            );
          })
        ) : (
          <></>
        )}
      </main>
    </>
  );
};

const TodoCard = ({ todo }: TodoCardProps) => {
  //, handleClick
  return (
    <section
      className="flex flex-row justify-between items-center w-96 p-6 duration-500 border-2 border-gray-500 rounded shadow-xl motion-safe:hover:scale-105"
      // onClick={() => handleClick()}
    >
      <h2 className="text-lg text-gray-700">{todo.description}</h2>
      <p className="text-sm text-gray-600">
        is complete: {todo.isComplete ? "true" : "false"}
      </p>
    </section>
  );
};

export default Home;
