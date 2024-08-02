"use client";

import { useState } from "react";
import { trpc } from "../_trpc/client";
import { serverClient } from "../_trpc/serverClient";

export default function TodoList({
  initialTodos,
}: {
  initialTodos: Awaited<ReturnType<(typeof serverClient)["getTodos"]>>;
}) {
  const [content, setContent] = useState("");

  const getTodos = trpc.getTodos.useQuery(undefined, {
    initialData: initialTodos,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  const addTodo = trpc.addTodo.useMutation({
    onSettled: () => {
      getTodos.refetch();
    },
  });
  const setDone = trpc.setDone.useMutation({
    onSettled: () => {
      getTodos.refetch();
    },
  });

  return (
    <div>
      <div className="text-white my-5 text-3xl">
        {getTodos.data.map((todo) => (
          <div key={todo.id} className="flex gap-3 items-center">
            <input
              type="checkbox"
              checked={!!todo.done}
              style={{ zoom: 1.5 }}
              onChange={() => setDone.mutate({ id: todo.id, done: todo.done ? 0 : 1 })}
              id={`check-${todo.id}`}
            />
            <label htmlFor={`check-${todo.id}`}>
              <span>{todo.content}</span>
            </label>
          </div>
        ))}
      </div>
      <div className="flex gap-3 items-center">
        <label htmlFor="content">Content</label>
        <input
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="text-black flex-grow bg-white rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        <button
          onClick={async () => {
            if (content.length) {
              addTodo.mutate(content);
              setContent("");
            }
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        >
          Add Todo
        </button>
      </div>
    </div>
  );
}
