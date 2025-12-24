### steps to run project locally

```sh
# clone the repo
git clone https://github.com/roshankosare/cjs.git

```

### frontend

```sh
# step 1
cd frontend

# step 2

npm install

# step 3

npm run dev

```

### backend

```sh
# step 1

cd CjsApi

# step 2
# to run project with hot reload
dotnet watch run

```

### contribution


### step 1 - fork the repository
### click on the Fork button on GitHub

### step 2 - clone your fork
git clone https://github.com/<your-username>/cjs.git
cd cjs

### step 3 - create a new branch
git git  feature/issue-<issue-id>-short-description

### example:
### git checkout -b feature/issue-12-add-pagination

### step 4 - make your changes
#### ensure your changes address the issue completely

### step 5 - commit your changes
### mention the issue id in the commit message
git add .
git commit -m "Fix issue #<issue-id>: short description of change"

### example:
### git commit -m "Fix issue #12: add pagination to problems page"

### step 6 - push to your fork
#### git push origin feature/issue-<issue-id>-short-description

### step 7 - create a pull request
### while creating the PR:
 - mention the issue id in the PR title
 - mention the issue id in the PR description
 - use keywords like: Fixes #<issue-id> or Closes #<issue-id>

#### example:
 PR Title: Fix #12: Add pagination to problems page
 PR Description: Fixes #12
