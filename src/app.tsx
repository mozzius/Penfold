import { useMutation, useQuery } from "react-query";

import { Button } from "@/components/ui/button";
import db from "@/lib/database";

function App() {
  const example = useQuery(["example"], async () => {
    const result = await db.select("SELECT * FROM example;");
    return result;
  });
  const add = useMutation({
    mutationFn: async (name: string) =>
      await db.execute("INSERT INTO example (name) VALUES (?);", [name]),
    onSettled: () => example.refetch(),
  });
  const clear = useMutation({
    mutationFn: async () => await db.execute("DELETE FROM example;"),
    onSettled: () => example.refetch(),
  });

  console.log(example.data);

  return (
    <div className="w-full h-full flex flex-col">
      <h1 className="text-xl text-center">Welcome to Tauri!</h1>
      <div>
        <Button onClick={() => add.mutate("test")}>Add</Button>
        <Button onClick={() => clear.mutate()}>Clear</Button>
      </div>
      <pre>{JSON.stringify(example.data, null, 2)}</pre>
    </div>
  );
}

export default App;
