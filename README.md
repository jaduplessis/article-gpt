# article-gpt

> RAG for article-gpt Spec

## Project requirements

### Pyenv and `Python 3.11.7`

- Install [pyenv](https://github.com/pyenv/pyenv) to manage your Python versions and virtual environments:

  ```bash
  curl -sSL https://pyenv.run | bash
  ```

  - If you are on MacOS and experiencing errors on python install with pyenv, follow this [comment](https://github.com/pyenv/pyenv/issues/1740#issuecomment-738749988)
  - Add these lines to your `~/.bashrc` or `~/.zshrc` to be able to activate `pyenv virtualenv`:
    ```bash
    eval "$(pyenv init -)"
    eval "$(pyenv virtualenv-init -)"
    eval "$(pyenv init --path)"
    ```
  - Restart your shell

- Install the right version of `Python` with `pyenv`:
  ```bash
  pyenv install 3.11.7
  ```

### Poetry

- Install [Poetry](https://python-poetry.org) to manage your dependencies and tooling configs:
  ```bash
  curl -sSL https://install.python-poetry.org | python - --version 1.5.1
  ```
  _If you have not previously installed any Python version, you may need to set your global Python version before installing Poetry:_
  ```bash
  pyenv global 3.11.7
  ```

### Docker Engine

Install [Docker Engine](https://docs.docker.com/engine/install/) to build and run the API's Docker image locally.

## Installation

### Create a virtual environment

Create your virtual environment and link it to your project folder:

```bash
pyenv virtualenv 3.11.7 article-api-rag
pyenv local article-api-rag
```

Now, every time you are in your project directory your virtualenv will be activated thanks to `pyenv`!

### Install Python dependencies through poetry

```bash
poetry install --no-root
```


## API

The project includes an API built with [FastAPI](https://fastapi.tiangolo.com/). Its code can be found at `src/api`.

The API is containerized using a [Docker](https://docs.docker.com/get-started/) image, built from the `Dockerfile` and `docker-compose.yml` at the root.

### Environment Variables

Copy .env_example to .env and fill in the values.

### Build and start the API

To build and start the API, use the following Makefile command:

```bash
make start-api
```

For more details on the API routes, check the automatically generated [swagger](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-postman-data) at the `/docs` url.
