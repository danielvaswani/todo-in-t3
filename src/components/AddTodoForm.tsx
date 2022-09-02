import { trpc } from "../utils/trpc";

const AddTodoForm = () => {
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
    async onSuccess() {
      await utils.invalidateQueries(["todo.getAll"]);
    },
  });

  const addTodo = (description: string) => {
    addTodoQuery.mutate(description);
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
