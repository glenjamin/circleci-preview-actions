# CircleCI Preview Actions

> WARNING: this is experimental and should not be considered production software.

## Trigger Pipeline

### Usage

```yaml
- uses: glenjamin/circleci-preview-actions/trigger-pipeline@v1
  with:
    token: ${{ secrets.CIRCLE_TOKEN }}
```

We publish `@v1` as a mutable version, which will aim to not break backwards compatibility. If you would like to use a fixed version, see the GitHub Releases page for a list of tags.

For more parameters see [./trigger-pipeline/action.yml](./trigger-pipeline/action.yml)

## License

TBC
