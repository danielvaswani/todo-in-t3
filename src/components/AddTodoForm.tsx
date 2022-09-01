import { trpc } from "../utils/trpc";
import { useState } from "react";

const AddTodoForm = () => {
  const utils = trpc.useContext();

  const [inputText, setInputText] = useState("");
  const handleSubmit = (event: React.SyntheticEvent) => {
    // 👇️ prevent page refresh
    event.preventDefault();
    const inputText: HTMLInputElement = document.querySelector("#inputText")!;
    addTodo(inputText.value);
    setInputText("");
    inputText.value = "";
  };

  const updateInputText = (description: string) => {
    setInputText(description);
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
        onChange={(event) => updateInputText(event.target.value)}
        className="rounded px-1 border-2 border-gray-500"
      />
      <button type="submit" className="rounded px-1 border-2 border-gray-500">
        Submit
      </button>
    </form>
  );
};

export default AddTodoForm;
