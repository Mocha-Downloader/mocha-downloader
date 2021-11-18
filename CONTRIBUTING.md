# Contributing

All development-related documents are written in English only.

모든 개발 관련 문서는 오직 영어로만 작성되었습니다.

- The project adheres to [semantic versioning](https://semver.org).

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