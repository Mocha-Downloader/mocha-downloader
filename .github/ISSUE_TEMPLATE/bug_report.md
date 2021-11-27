---
name: Bug report
about: Let us know how our app is misbehaving
title: "[BUG] "
labels: bug
assignees: ''

body:
    - type: markdown
      id: description
      attributes:
          label: What happened?
          description: Include any necessary background information.
          value: |
"## What happened and what's the expected result?

## Steps to Reproduce
"

    - type: checkboxes
      id: not-a-duplicate
      attributes:
          label: This is not a duplicate issue
          description: Search for duplicate issues in the [issues page](https://github.com/Mocha-Downloader/mocha-downloader/issues)
          options:
              - label: This is a unique issue, and is not a duplicate.
                required: true
      validations:
          required: true
---

**Description**

**Expected behavior**

**How to reproduce**

1. ...
2. ...
3. ...
