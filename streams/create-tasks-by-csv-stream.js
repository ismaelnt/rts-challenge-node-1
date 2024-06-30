import fs from "node:fs";
import { parse } from "csv-parse";

const CSV_PATH = new URL("./tasks.csv", import.meta.url);

const stream = fs.createReadStream(CSV_PATH);

const parser = parse({
  columns: true,
  delimiter: ",",
});

async function createTasksByCsvStream() {
  const linesParse = stream.pipe(parser);

  for await (const line of linesParse) {
    const { title, description } = line;

    await fetch("http://localhost:3333/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description }),
    });
  }
}

createTasksByCsvStream();
