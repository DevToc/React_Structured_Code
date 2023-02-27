# Venngage Editor2

### Node / NPM versions

```
% node --version
v16.15.0
% npm --version
8.5.5
```

## Documentation

See here - [Docusaurus site](https://editor2-docs.vercel.app)

## Local development

Copy example.env to .env and use port 3000 by default
```
cp example.env .env
```

## Build docker container
```
# Run build command once unless there is new configuration change
docker compose build

# Start container services
docker compose up -d
```

## Install app deps and start dev server within docker container
```
# enter container
docker compose exec editor2 bash

# install latest deps
npm install

# start dev server
npm start
```
App endpoint [http://localhost:3000](http://localhost:3000)

## Without docker container
```
# install latest deps
npm ci

# start dev server
npm start
```

## E2E test
Note: running e2e outside of docker container requires headless chrome install within host system
```
npm run test:e2e
```

## Dependency checker

Create dependency checker report

```
npm install --save-dev dependency-cruiser
depcruise --config .dependency-cruiser.js src
```

## Notes on dependencies

Current `package.json` definition installs multiple versions of `react-refresh` (0.11 & 0.13), which causes
typescript builder to fail with this error:

```
ERROR in ./src/widgets/WidgetGroupToolbar.tsx 1:40-115
Module not found: Error: You attempted to import /Users/kyulee/Code/editor2/node_modules/react-refresh/runtime.js which falls outside of the project src/ directory. Relative imports outside of src/ are not supported.
You can either move it inside src/, or add a symlink to it from project's node_modules/.
 @ ./src/modules/Editor/components/Toolbar/SelectedWidgetToolbar.tsx 10:0-76 25:36-54
 @ ./src/modules/Editor/components/Toolbar/Toolbar.tsx 9:0-64 25:54-75
 @ ./src/modules/Editor/components/Toolbar/index.ts 3:0-26 3:0-26
 @ ./src/modules/Editor/Editor.tsx 8:0-47 37:44-51
 @ ./src/modules/Editor/index.ts 3:0-30 4:15-21
 @ ./src/App.tsx 14:44-18:19
 @ ./src/index.tsx 6:0-24 9:33-36
```

This is fixed by forcing npm to install single version of `react-refresh@0.13.0`.

```json
{
  "overrides": {
    "react-refresh": "0.13.0"
  }
}
```

hi
