import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import TodoCard from "../components/TodoCard/TodoCard";
import AddTodoForm from "../components/AddTodoForm";

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
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex select-none flex-col gap-2 items-center justify-center min-h-screen p-4">
        {todosQuery.data ? (
          todosQuery.data
            .sort((t1, t2) => t1.id - t2.id)
            .map((todoItem) => {
              return (
                // <div onClick={() => toggleTodo(index)}>
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
                // </div>
              );
            })
        ) : (
          <></>
        )}
        <AddTodoForm />
      </main>
    </>
  );
};

export default Home;
