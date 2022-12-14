name: ADC Release

on:
  workflow_dispatch:
    inputs:
      forcePublish:
        type: boolean
        description: "Force a release to NPM Only"
        required: false

jobs:
  publish-npm:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - uses: actions/setup-node@v1
        with:
          node-version: 14
      - name: Cache dependencies
        id: cache
        uses: actions/cache@v2
        with:
          path: ./node_modules
          key: modules-${{ hashFiles('package-lock.json') }}
      - name: Install dependencies
        if: steps.cache.outputs.cache-hit != 'true'
        run: npm i --ignore-scripts --legacy-peer-deps
      - name: Run post install scripts
        run: npm rebuild
      - name: Graduate Version
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git fetch --all --tag
          npx lerna version --conventional-commits --conventional-graduate -m "chore(release): publish %v" --no-private --no-changelog --force-publish --yes --exact --no-push
          git push 
          git push --tags
      - name: build changelog
        run: |
          git fetch --all --tag
          git tag -l | grep -vE '^v[0-9]+\.[0-9]+\.[0-9]+$' | xargs git tag -d
          npx conventional-changelog -p angular -i CHANGELOG.md --skip-unstable -s -r 2
          git add .
          git commit -m 'chore(changelog): update changelog'
      - name: "Get latest tag"
        id: latest_tag
        run: |
          git fetch --all --tag
          echo "$(git tag --sort=-creatordate | head -1)"
          echo "::set-output name=name::$(git tag --sort=-creatordate | head -1)"
      - name: Create Main Release
        run: gh release create ${{ steps.latest_tag.outputs.name }} --generate-notes
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      - name: Extract branch name
        shell: bash
        run: echo "##[set-output name=branch;]$(echo ${GITHUB_REF#refs/heads/})"
        id: extract_branch
      # Create PR for merge into alpha
      - name: Check if main to alpha PR already exists
        id: "check-if-main-pr-already-exists"
        if: ${{steps.extract_branch.outputs.branch == 'main' }}
        uses: fjenik/check-if-pr-exists@0.0.3
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
          target-branch: alpha
          source-branch: main
      - name: Create pull request
        if: ${{ steps.check-if-main-pr-already-exists.outputs.is-pr-already-created == 'false' && steps.extract_branch.outputs.branch == 'main'  }}
        uses: fjenik/create-pull-request@0.0.12
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
          target-branch: alpha
          source-branch: main
          pr-body: |
            _This PR was generated via github actions workflow to prepare the merge from main to alpha_
          pr-title: "chore(release): Merge main into alpha."