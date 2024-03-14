# Qwik TikTok Microfrontends

![homepage](docs/homepage.png)

node >= v20.11.1 required

## The project contains 2 apps ( Host, Upload )

### Host

port: 5173

![host](docs/host.png)

### Upload ( horizontal split )

port: 5174

![upload](docs/upload.png)

## Startup project

From the root install all the dependencies `pnpm i`

## Preview server ( run in different terminals )

- `npm run preview:host`
- `npm run preview:upload`

## Development server

Run `npm run serve:all` to run a dev server for each application.

At http://localhost:5173 you can open the host and see the working application.
