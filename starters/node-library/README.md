# {{package-name}}

{{description}}

## 🚀 Getting Started

**Install dependencies:**

```bash
pnpm install
```

**Run tests:**

```bash
pnpm test
```

**Build for production:**

```bash
pnpm build
```

## 📦 Releasing

This project uses [Changesets](https://github.com/changesets/changesets) to manage releases.

1.  **Generate a changeset**: `pnpm changeset`
2.  **Commit the changeset**: Commit the generated file in the `.changeset` directory.
3.  **Push to main**: When the PR is merged, the release workflow will automatically version the package and publish it to npm.
