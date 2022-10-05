import type { NextPage } from "next";
import { trpc } from "../utils/trpc";
import TodoCard from "../components/TodoCard";
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
    onMutate: async (newTodo) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)

      await utils.cancelQuery(["todo.getAll"]);

      // Snapshot the previous value

      const previousTodos = utils.getQueryData(["todo.getAll"]);

      // Optimistically update to the new value

      utils.setQueryData(
        ["todo.getAll"],
        previousTodos!.map((item) => {
          if (item.id === newTodo.id) item.isComplete = !item.isComplete;
          return item;
        })
      );

      // Return a context with the previous and new todo

      return { previousTodos };
    },

    // If the mutation fails, use the context we returned above

    onError: (_err, _newTodo, context) => {
      utils.setQueryData(["todo.getAll"], context!.previousTodos!);
    },

    // Always refetch after error or success:
    onSettled: () => {
      utils.invalidateQueries("todo.getAll");
    },
  });

  const deleteTodoQuery = trpc.useMutation("todo.delete", {
    onMutate: async (deleteTodo) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)

      await utils.cancelQuery(["todo.getAll"]);

      // Snapshot the previous value

      const previousTodos = utils.getQueryData(["todo.getAll"]);

      // Optimistically update to the new value

      utils.setQueryData(
        ["todo.getAll"],
        previousTodos!.filter((item) => item.id !== deleteTodo.id)
      );

      // Return a context object with the snapshotted value

      return { previousTodos };
    },

    // If the mutation fails, use the context returned from onMutate to roll back

    onError: (_err, _newTodo, context) => {
      utils.setQueryData(["todo.getAll"], context!.previousTodos!);
    },

    // Always refetch after error or success:

    onSettled: () => {
      utils.invalidateQueries("todo.getAll");
    },
  });

  const moveDownQuery = trpc.useMutation("todo.moveDown", {
    onMutate: async (movement) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)

      await utils.cancelQuery(["todo.getAll"]);

      // Snapshot the previous value

      const previousTodos = utils.getQueryData(["todo.getAll"]);

      // Optimistically update to the new value

      utils.setQueryData(["todo.getAll"], (old) => {
        let newData = old!
          .map((oldItem) => {
            if (oldItem.pos > movement.pos && oldItem.pos <= movement.newPos) {
              oldItem.pos -= 1;
            }
            return oldItem;
          })
          .map((oldItem) => {
            if (oldItem.id === movement.id) {
              oldItem.pos = movement.newPos;
            }
            return oldItem;
          });
        return newData;
      });

      // Return a context object with the snapshotted value

      return { previousTodos };
    },

    // If the mutation fails, use the context returned from onMutate to roll back

    onError: (_err, _newTodo, context) => {
      utils.setQueryData(["todo.getAll"], context!.previousTodos!);
    },

    // Always refetch after error or success:

    onSettled: () => {
      utils.invalidateQueries("todo.getAll");
    },
  });

  const moveUpQuery = trpc.useMutation("todo.moveUp", {
    onMutate: async (movement) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)

      await utils.cancelQuery(["todo.getAll"]);

      // Snapshot the previous value

      const previousTodos = utils.getQueryData(["todo.getAll"]);

      // Optimistically update to the new value

      utils.setQueryData(["todo.getAll"], (old) => {
        let newData = old!
          .map((oldItem) => {
            /*
             gte: input.newPos,
              lt: input.pos,
            */
            if (oldItem.pos >= movement.newPos && oldItem.pos < movement.pos) {
              oldItem.pos += 1;
            }
            return oldItem;
          })
          .map((oldItem) => {
            if (oldItem.id === movement.id) {
              oldItem.pos = movement.newPos;
            }
            return oldItem;
          });
        return newData;
      });

      // Return a context object with the snapshotted value

      return { previousTodos };
    },

    // If the mutation fails, use the context returned from onMutate to roll back

    onError: (_err, _newTodo, context) => {
      utils.setQueryData(["todo.getAll"], context!.previousTodos!);
    },

    // Always refetch after error or success:

    onSettled: () => {
      utils.invalidateQueries("todo.getAll");
    },
  });

  // console.log("todos data is", todosQuery.data);
  // const [todos, setTodos] = useState(todosData ? [...todosData] : []);
  const [currentLine, setCurrentLine] = useState(-1);
  const [movePos, setMovePos] = useState(0);
  const [currentId, setCurrentId] = useState(0);

  const toggleTodo = (atIndex: number, newValue: boolean) => {
    setIsComplete.mutate({
      id: atIndex,
      isComplete: newValue,
    });
    console.log("toggled todo");
  };

  const deleteTodo = (id: number, pos: number) => {
    deleteTodoQuery.mutate({ id: id, pos: pos });
    console.log("deleted todo");
  };

  const movePosToLine = (id: number, from: number, toLine: number) => {
    if (from === toLine || from === toLine + 1) return;
    let toPos = toLine;
    if (from > toLine) {
      //moveUp toLine + 1
      toPos += 1;
      moveUpQuery.mutate({ id: id, pos: from, newPos: toPos });
    } else {
      //moveDown toLine
      moveDownQuery.mutate({ id: id, pos: from, newPos: toPos });
    }
    console.log("Moving pos " + from + " to pos " + toPos);
  };

  return (
    <main
      className="container mx-auto flex select-none flex-col items-center justify-center min-h-screen"
      onDragEnd={() => {
        movePosToLine(currentId, movePos, currentLine);
        setCurrentId(-1);
        setCurrentLine(-1);
        setMovePos(-1);
      }}
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
                    onDrop={(e) => e.preventDefault()}
                    onDragOver={(e) => e.preventDefault()}
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
                      deleteTodo(todoItem.id, todoItem.pos);
                    }}
                    handleMove={(pos, id) => {
                      setMovePos(pos);
                      setCurrentId(id);
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
          onDragOver={(e) => e.preventDefault()}
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
      <AddTodoForm index={todosQuery.data ? todosQuery.data.length + 1 : 1} />
    </main>
  );
};

export default Home;
