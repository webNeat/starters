#!/usr/bin/env node
import path from "path";
import { fileURLToPath } from "url";
import { cp, mkdir, readFile, writeFile } from "fs/promises";
import enquirer from "enquirer";
import starters from "./starters.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const starter_names = Object.keys(starters);

  const { name } = await enquirer.prompt({
    type: "select",
    name: "name",
    message: "Choose a starter",
    choices: starter_names,
  });

  const { dir } = await enquirer.prompt({
    type: "input",
    name: "dir",
    message: "Destination directory",
  });

  console.log(`Let's fill placeholders of the ${name} starter ...`);
  const { placeholders, templates } = starters[name];

  const values = {};
  for (const [key, description] of Object.entries(placeholders)) {
    const { value } = await enquirer.prompt({
      type: "input",
      name: "value",
      message: description,
    });
    values[key] = value;
  }

  console.log(`Copying the starter files to ${dir} ...`);
  await mkdir(dir, { recursive: true });
  await cp(path.join(__dirname, "starters", name), dir, { recursive: true });

  console.log(`Replacing placeholders ...`);
  for (const template of templates) {
    await render(path.join(dir, template), values);
  }
  console.log(`Done!`);
}

async function render(file, values) {
  let content = await readFile(file, "utf-8");
  for (const [key, value] of Object.entries(values)) {
    content = content.replaceAll(key, value);
  }
  await writeFile(file, content);
}

main()
  .catch(console.error)
  .then(() => process.stdin.destroy());
