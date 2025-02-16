import path from "path";
import { exec } from "child_process";
import { createInterface } from "readline";
import { cp, mkdir, readFile, rm, writeFile } from "fs/promises";

const starters = {};
starters["react-library"] = {
  placeholders: {
    "{{package-name}}": "Your package name, e.g. react-library",
    "{{description}}": "A short description of your library",
    "{{repo}}": "Your repository name, e.g. webneat/react-library",
  },
  templates: [".changeset/config.json", "package.json", "README.md"],
};

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  const starter_names = Object.keys(starters);
  const index = await ask(
    [
      "Please choose a starter (enter the corresponding number):",
      ...starter_names.map((name, i) => `${i + 1}. ${name}`),
    ].join("\n")
  );
  const dir = await ask("Destination directory:");
  const name = starter_names[index - 1];
  const { placeholders, templates } = starters[name];
  const values = {};
  for (const [key, description] of Object.entries(placeholders)) {
    values[key] = await ask(description);
  }

  const tmp_dir = `tmp-${Date.now()}-starters`;
  console.log(
    `Cloning the starters repository into a temporary directory ${tmp_dir} ...`
  );
  await $(`git clone https://github.com/webneat/starters.git ${tmp_dir}`);

  let error;
  try {
    console.log(`Copying the starter files to ${dir} ...`);
    await mkdir(dir, { recursive: true });
    await cp(`${tmp_dir}/${name}`, dir, { recursive: true });
    console.log(`Replacing placeholders ...`);
    for (const template of templates) {
      await render(path.join(dir, template), values);
    }
  } catch (err) {
    error = err;
  }
  console.log(`Removing the template directory ...`);
  await rm(tmp_dir, { recursive: true, force: true });
  if (error) throw error;
  console.log(`Done!`);
}

async function ask(message) {
  return new Promise((resolve) => rl.question(message + "\n", resolve));
}

async function $(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }
      resolve({ stdout, stderr });
    });
  });
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
  .then(() => rl.close());
