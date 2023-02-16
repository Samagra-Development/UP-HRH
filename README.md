# Ratings Application

## Lego Blocks
- [Workflow Manager (Enketo)](https://github.com/SakshamHaryana-SE/enketo)
- [Fusionauth](https://fusionauth.io/docs/v1/tech/)

## Tech Stack
- [React.js](https://reactjs.org/docs/getting-started.html)
- [Tailwind](https://tailwindcss.com/docs/installation)
- [GraphQL](https://graphql.org/code/#javascript)
- [Hasura](https://hasura.io/docs/latest/index/)

## Installation Guide

## Requirements :scroll:

1. Your machine should have [Yarn](https://classic.yarnpkg.com/en/docs/install/#windows-stable) (preferable) or [Npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) or [Docker](https://docs.docker.com/get-docker/) installed.

## Installation Steps :walking:

### 1. Fork it :fork_and_knife:

You can get your own fork/copy of [UP-HRH](https://github.com/Samagra-Development/UP-HRH) by using the <kbd><b>Fork</b></kbd> button.

### 2. Clone it :busts_in_silhouette:

You need to clone (download) it to a local machine using

```sh
git clone https://github.com/Your_Username/UP-HRH.git
```

> This makes a local copy of the repository in your machine.

Once you have cloned the `UP-HRH` repository in GitHub, move to that folder first using the change directory command.

```sh
# This will change directory to a folder UP-HRH
cd UP-HRH
```

Move to this folder for all other commands.

### 3. Set it up :arrow_up:

Run the following commands to see that _your local copy_ has a reference to _your forked remote repository_ in GitHub :octocat:

```sh
git remote -v
origin  https://github.com/Your_Username/UP-HRH.git (fetch)
origin  https://github.com/Your_Username/UP-HRH.git (push)
```

Now, add a reference to the original [UP-HRHUI](https://github.com/Samagra-Development/UP-HRH) repository using

```sh
git remote add upstream https://github.com/Samagra-Development/UP-HRH.git
```

> This adds a new remote named **_upstream_**.

See the changes using

```sh
git remote -v
origin    https://github.com/Your_Username/UP-HRH.git (fetch)
origin    https://github.com/Your_Username/UP-HRH.git (push)
upstream  https://github.com/Samagra-Development/UP-HRH.git (fetch)
upstream  https://github.com/Samagra-Development/UP-HRH.git (push)
```

### 4. Run it :checkered_flag:

Using Yarn (preferable)
```sh
# To install all the dependencies
yarn install

# To start the application
yarn start
```

**OR**

using NPM
```sh
# To install all the dependencies
npm install

# To start the application
npm start
```
The React application will start on port 3000.
Go to: http://localhost:3000

## Environment

```.env
REACT_APP_USER_SERVICE_URL=
REACT_APP_APPLICATION_ID=
REACT_APP_HASURA_URL=
REACT_APP_ENKETO_URL=
REACT_APP_ENKETO_URL=
HASURA_REST_API_URL=
HASURA_ADMIN_SECRET=
```

## Data uploading

Scripts reside inside the `scripts` folder. To run scripts, create copies of data inside the `scripts/input/samples` folder inside `scripts/inputs` and insert data as per the format mentioned in the samples. 

Note: Ensure `.env` is updated. 

### To upload institutes:

Command: `python3 institute_upload.py`

Input file: `scripts/input/institutes/InstituteData.csv`
Sample input file: `scripts/input/samples/institutes/InstituteData.csv`

### To upload assessors:

Command: `python3 assessors_upload.py`

Input file: `scripts/input/assessors/CodePhonenumberMapping.csv`, `scripts/input/assessors/PhonenumberUserIdMapping.csv`
Sample input file: `scripts/input/samples/assessors/CodePhonenumberMapping.csv`, `scripts/input/samples/assessors/PhonenumberUserIdMapping.csv`

Note: New users will be needed to be created on fusionauth using https://github.com/choxx/hasura-fa-user-creation-script

### To upload schedules:

Command: `python3 schedule_upload.py`

Input file: `scripts/input/scheduling/AssessmentSchedule.csv`
Sample input file: `scripts/input/samples/scheduling/AssessmentSchedule.csv`
