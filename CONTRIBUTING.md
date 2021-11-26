# Contributing

All development-related documents are written in English only.

모든 개발 관련 문서는 오직 영어로만 작성되었습니다.

## Conventions

- The project adheres to [semantic versioning](https://semver.org).
- use yarn instead of npm.
- Due to issues like [this](https://github.com/nodejs/node-gyp/issues/2534) all contributors are expected to use node v16
  - [nvm](https://github.com/nvm-sh/nvm) is a good tool for this.
- use function components instead of class components in react.

### Variabe naming

## Required skill

The following skills are absolutely necessary to start contributing code to Mocha Downloader.

- English
- [Google-fu](https://www.urbandictionary.com/define.php?term=google-fu)

## Getting Started

### 0. Install pre-requirements.

- bash terminal (git bash, etc.)
- git
- Node.js & npm
- yarn

### 1. Clone this repository.

```
git clone https://github.com/Mocha-Downloader/mocha-downloader
```

### 2. Install dependencies.

```
yarn install
```

[Depending on your platform](https://sharp.pixelplumbing.com/install#prebuilt-binaries), you may have to install `libvips` manually.

### 4. Test locally

```
yarn start
```

### 5. Build for production

```
yarn package
```

## Adding new platform

- Make a file in the [`src/main/platforms`](./src/main/platforms) directory.
  - must have a meta property and a logic function. Check [`src/main/constants.ts`](./src/main/constants.ts) for more info.
- export it in [`src/main/platforms/index.ts`](./src/main/platforms/index.ts)
- add a 16x16px sized png icon to [`./assets`](./assets)

## [documentation and blog](https://github.com/Mocha-Downloader/mocha-downloader.github.io)

The documentation and blog website is built with [docusaurus](https://docusaurus.io).

### Setting up

#### 1. Clone the repository

```
git clone https://github.com/Mocha-Downloader/mocha-downloader.github.io.git
```

#### 2. Install dependencies

```
yarn install
```

#### 3. Test locally

```
yarn start
```

Test different locale:

```
yarn start --locale <code>
```

available locale:

- en
- ko

## Editors & IDEs

vscode users can install the [recommended extensions](./.vscode/extensions.json).

other IDE users must have the following feature:

- [editorconfig](./.editorconfig) support
- [prettier formatter](./.prettierrc)

recommended alternative editors/IDEs:

- vim
- emacs
- webstorm (paid)

## Troubleshooting

### `yarn XXX` command fails

e.g.

- `yarn start`: Error while importing `semantic.min.css`
- `yarn icons`: `Could not find MIME for Buffer <null>`

**Solution**: Run the command again.

I can't believe it either but it works the second time for some reason.
