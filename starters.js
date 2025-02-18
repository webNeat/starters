export default {
  "react-library": {
    placeholders: {
      "{{package-name}}": "Your package name, e.g. react-library",
      "{{description}}": "A short description of your library",
      "{{repo}}": "Your repository name, e.g. webneat/react-library",
    },
    templates: [
      ".changeset/config.json",
      "first-steps.todo",
      "package.json",
      "README.md",
    ],
  },
  "adonis-inertia": {
    placeholders: {
      "{{app-name}}": "Your application name, e.g. my-awesome-app",
      "{{domain}}": "Your domain name, e.g. my-awesome-app.com",
    },
    templates: [
      "first-steps.todo",
      "package.json",
      "deployment.js",
      "README.md",
    ],
  },
};
