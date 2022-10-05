import { trpc } from "../utils/trpc";

type AddTodoFormProps = {
  index: number;
};

const AddTodoForm = ({ index }: AddTodoFormProps) => {
  const utils = trpc.useContext();

  const handleSubmit = (event: React.SyntheticEvent) => {
    // 👇️ prevent page refresh
    event.preventDefault();
    const inputTextElement: HTMLInputElement =
      document.querySelector("#inputText")!;
    addTodo(inputTextElement.value);
    inputTextElement.value = "";
  };

  const addTodoQuery = trpc.useMutation("todo.add", {
    onMutate: async (newTodo) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)

      await utils.cancelQuery(["todo.getAll"]);

      // Snapshot the previous value

      const previousTodos = utils.getQueryData(["todo.getAll"]);

      // Optimistically update to the new value

      utils.setQueryData(["todo.getAll"], (old) => [...(old as any), newTodo]);

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

  const addTodo = (description: string) => {
    addTodoQuery.mutate({ description: description, pos: index });
    console.log("todo " + description + " added");
  };

  //, handleClick
  return (
    <form
      className="flex flex-row gap-2 items-center"
      onSubmit={(event) => handleSubmit(event)}
    >
      <label htmlFor="description">Add Todo</label>
      <input
        type="text"
        name="description"
        id="inputText"
        className="rounded px-1 border-2 border-gray-500"
      />
      <button type="submit" className="rounded px-1 border-2 border-gray-500">
        Submit
      </button>
    </form>
  );
};

export default AddTodoForm;
