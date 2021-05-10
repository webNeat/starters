# REST API template

A REST API project starter based on [Adonis](https://adonisjs.com/).

## Usage

- Search and replace placeholders
  - `{{name}}`: The name of the app (in snake-case, used for docker containers).
  - `{{domain}}`: The domain of the app.
  - `{{app-port}}`: The port where to run the application.
  - `{{adminer-port}}`: The port where to run adminer (to access the databases).

- Create Github secrets on the project:
  - `VPS_USER`: the username on the deployment server.
  - `VPS_SSH_KEY`: a private ssh key authorized by the server.
