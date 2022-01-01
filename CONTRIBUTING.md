# Contributing

- All development-related documents are written in English only.
- 모든 개발 관련 문서는 오직 영어로만 작성되었습니다.

## Conventions

- The project adheres to [semantic versioning](https://semver.org).
- Use yarn instead of npm.
- Due to issues like [this](https://github.com/nodejs/node-gyp/issues/2534), all contributors are expected to use the latest version of node v16.
  - [nvm](https://github.com/nvm-sh/nvm) is a good tool for this.
- Use function components instead of class components in react.

## Required skill

The following skills are absolutely necessary to start contributing code to Mocha Downloader.

- English
- [Google-fu](https://www.urbandictionary.com/define.php?term=google-fu)
- [jsdoc](https://jsdoc.app)
- javascript and typescript
- react

## Helpful resources

- [semantic UI react docs](https://react.semantic-ui.com)
- electron ipc ([main](https://www.electronjs.org/docs/latest/api/ipc-main) & [renderer](https://www.electronjs.org/docs/latest/api/ipc-renderer))
- [electron-builder Two package.json Structure](https://www.electron.build/tutorials/two-package-structure.html)

## Getting Started

### 0. Install pre-requirements.

- git
- Node.js & npm
- yarn

### 1. Clone this repository.

```
git clone https://github.com/Mocha-Downloader/mocha-downloader
```

### 2. Install npm dependencies.

```
yarn install
```

[Depending on your platform](https://sharp.pixelplumbing.com/install#prebuilt-binaries), you may have to install `libvips` manually.

### 4. Test locally

```
yarn start
```

- TIP: use development testing shortcuts.
  - Check `test` functions in [`platform`](./src/main/platforms) files for more detail.

### 5. Build for production

```
yarn package
```

## Adding new platform

- Make a file in the [`src/main/platforms`](./src/main/platforms) directory.
  - must have a meta property and a logic function. Check [`src/main/constants.ts`](./src/main/constants.ts) for more info.
  - export it in [`src/main/platforms/index.ts`](./src/main/platforms/index.ts)
- add a 16x16px sized png icon to [`./assets`](./assets)
- create new [label(s)](https://github.com/Mocha-Downloader/mocha-downloader/labels) for github issues page

  - format: `platform:<PLATFORM_ID>`

- add platform-specific settings

## Translations

Once we're applicable for [crowdin's open source project setup request](https://crowdin.com/page/open-source-project-setup-request), all translation related work are to be done in [crowdin](https://crowdin.com/project/mocha-downloader). Until then, contributors can make pull request directly in the `master` branch (not the `l10n_master` branch!).

## Editors & IDEs

vscode/vscodium users can install the [recommended extensions](./.vscode/extensions.json).

other IDE users must have the following feature:

- [editorconfig](./.editorconfig) support
- [prettier formatter](./.prettierrc) support

## Troubleshooting

### `yarn XXX` command fails

e.g.

- `yarn start`: Error while importing `semantic.min.css`
- `yarn icons`: `Could not find MIME for Buffer <null>`

**Solution**: Run the command again.

I can't believe it either but it works the second time for some reason.
