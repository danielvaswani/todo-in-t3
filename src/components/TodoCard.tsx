import { Todo } from "@prisma/client";
import { useState } from "react";
import { util } from "zod/lib/helpers/util";
import { trpc } from "../utils/trpc";

type TodoCardProps = {
  todo: Todo;
  handleToggle: () => void;
  handleDelete: () => void;
  handleMove: (pos: number, id: number) => void;
};

const TodoCard = ({
  todo,
  handleToggle,
  handleDelete,
  handleMove,
}: TodoCardProps) => {
  const utils = trpc.useContext();

  const [showTodo, setShowTodo] = useState(true);

  //, handleClick
  return (
    <section
      className={`${
        showTodo ? "flex" : "hidden"
      } flex-row justify-between items-center w-96 p-6 duration-500 border-2 border-gray-500 relative rounded shadow-xl motion-safe:hover:scale-105`}
      onClick={() => {
        handleToggle();
        // moveUpQuery.mutate({ id: todo.id, pos: todo.pos, newPos: 1 });
        console.log(todo.pos, todo.id);
      }}
      draggable={true}
      onDragStart={() => handleMove(todo.pos, todo.id)}
    >
      <p
        className="w-4 h-4 bg-red-600 text-white z-0 flex items-center justify-center rounded -m-1.5 absolute top-0 right-0 motion-safe:hover:scale-[2]"
        onClick={(e) => {
          setShowTodo(!showTodo);
          handleDelete();
          e.stopPropagation();
        }}
      >
        X
      </p>
      <h2 className="text-lg text-gray-700">{todo.description}</h2>
      <p className="text-sm text-gray-600">
        is complete: {todo.isComplete ? "true" : "false"}
      </p>
    </section>
  );
};

export default TodoCard;
