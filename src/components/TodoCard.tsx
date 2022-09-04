import { Todo } from "@prisma/client";
import { useState } from "react";
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
      } flex-row justify-between items-center w-96 p-6 duration-500 ${
        todo.isComplete ? "bg-blue-100" : "bg-white"
      } border-2 border-gray-500 relative rounded shadow-xl motion-safe:hover:scale-105 hover:border-blue-500`}
      onClick={() => {
        handleToggle();
        // moveUpQuery.mutate({ id: todo.id, pos: todo.pos, newPos: 1 });
        console.log(todo.pos, todo.id);
      }}
      draggable={true}
      onDragStart={() => handleMove(todo.pos, todo.id)}
      onDragEnd={(e) => e.preventDefault()}
    >
      <div
        className="w-4 h-4 bg-red-600 text-white z-0 flex items-center justify-center rounded -m-1.5 absolute top-0 right-0 motion-safe:hover:scale-[2]"
        onClick={(e) => {
          setShowTodo(!showTodo);
          handleDelete();
          e.stopPropagation();
        }}
      >
        X
      </div>
      <p
        className="text-gray-70 w-full break-words"
        style={{
          fontSize:
            todo.description.length > 25 ? 35 - todo.description.length : 25,
        }}
      >
        {todo.description}
      </p>
    </section>
  );
};

export default TodoCard;
