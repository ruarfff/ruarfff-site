---
title: "How to only run a job on a pull request in CircleCI"
excerptOther: "It's tricky to conditionally run jobs in CircleCI. This is one method that might be useful in some cases."
postDate: "2021-07-27"
date: "2021-07-27"
tags:
  - circleci
  - pipelines
---

I wanted a thing to only happen when a pull request is opened. I also wanted to do some cleanup when the pull request is closed. In my last place we used GitHub actions and this was super easy.
Now I am using [CircleCI](https://circleci.com/) and this wasn't so easy.

In this post we will look at how to only run a job on a pull request in CircleCI. There is one major caveat. We also need a way to trigger the job on a pull request. We will look at how to do this with the [CircleCI web api](https://circleci.com/docs/api/v2/).

## Conditionally run a job

There are a few options you can use to only run a job on a pull request in CircleCI. There is the option to
[only ever build on a pull request](https://discuss.circleci.com/t/only-build-pull-requests-not-every-branch/200) but this is all or nothing
i.e. you can never run a build on a branch without opening a pull request.

Another option is, within a job, you can inspect the [environment variables](https://circleci.com/docs/2.0/env-vars/) to see if there is a pull request number like so:

```bash
 if [ "${CIRCLE_PULL_REQUEST##*/}" != "" ];then
    echo "Is a pull request"
fi
```

This is OK but it would be nice to conditionally run a whole job instead. It is not possible to read environment variables when the pipeline is loaded. It is only possible when a job is run.
To work around this we can use the [circleci/continuation](https://circleci.com/developer/orbs/orb/circleci/continuation) orb.
If you are trying this out, make sure to update your project settings in **Advanced Settings -> Enable dynamic config using setup workflows**.

CircleCI expects all your configuration in one file called `.circleci/config.yml`. The continuation orb takes over as the entry point giving you access to the environment variables and then runs the pipeline using whatever configuration you tell it to.
It's a little bit weird but it works.

This is an example of using the continuation orb to conditionally run a job only on a pull request.

`.circleci/config.yml`

```yaml
setup: true
version: 2.1
orbs:
  continuation: circleci/continuation@0.2.0
workflows:
  setup:
    jobs:
      - continuation/continue:
          configuration_path: ".circleci/main.yml"
          parameters: /home/circleci/params.json
          pre-steps:
            - run:
                command: |
                  if [ -z "${CIRCLE_PULL_REQUEST##*/}" ]
                  then
                    IS_PR=false
                  else
                    IS_PR=true
                  fi
                  echo '{ "is_pr": '$IS_PR' }' >> /home/circleci/params.json
```

Note, we mentioning PR here but you could do more or less anything to configure your pipeline there. `/home/circleci/params.json` is written to and specified with `parameters: /home/circleci/params.json`.

`.circleci/main.yml`

```yaml
version: 2.1

parameters:
  is_pr:
    type: boolean
    default: false

jobs:
  do_something:
    docker:
      - image: cimg/base:2021.04
    steps:
        - run:
            name: something
            command: echo 'You get the picture'

workflows:
  version: 2

   whence-pr:
    when: << pipeline.parameters.is_pr >>
    jobs:
      - do_something:
            name: something
```

We called the file `main.yml` here but it could be any file. You just need to specify it in the parameter called `configuration_path`. [This post](https://circleci.com/blog/building-cicd-pipelines-using-dynamic-config/) also shows another way to generate the configuration on the fly.

Now we have passed the `is_pr` parameter to the pipeline. We can conditionally run things using `when: << pipeline.parameters.is_pr >>`.

There is one major issue with this approach. Our build may have run before a PR (pull request) was ever opened. Opening a PR will not trigger a build in CircleCI.

## Triggering CircleCI pipeline when a pull request is opened

First thing you must do is grab a [CircleCi API token](https://circleci.com/docs/2.0/managing-api-tokens/). A [personal API token](https://app.circleci.com/settings/user/tokens) will do for this example.

You can trigger a pipeline run like so:

```bash
SCM=github
ORG=your-org-here
PROJECT=your-project-here
CIRCLE_BRANCH=a-derived-branch

curl -X POST \
    -H "Circle-Token: ${CIRCLE_TOKEN}" \
    -H 'Content-Type: application/json' \
    -H 'Accept: application/json' \
    -d "{\"branch\":\"${CIRCLE_BRANCH}\"}" \
    https://circleci.com/api/v2/project/${SCM}/${ORG}/${PROJECT}/pipeline
```

Hopefully it's clear what values you need to change there. How you will run this bit depends on what tools you have available to you. I was using GitHub and even though we use CircleCI, there are enough free [GitHub Action](https://github.com/features/actions) minutes for me to setup an action like this:

`.github/workflows/pr.yml`

```yaml
name: Trigger Build on PR

on:
  pull_request:
    types: [opened, reopened]

jobs:
  trigger-build:
    runs-on: ubuntu-latest

    steps:
      - name: Trigger CircleCI
        env:
          CIRCLE_BRANCH: ${{ github.head_ref }}
          CIRCLE_TOKEN: ${{ secrets.CIRCLE_TOKEN }}
          ORG: your-org-here
          PROJECT: your-project-here
        run: |
          curl -X POST \
          -H "Circle-Token: ${CIRCLE_TOKEN}" \
          -H 'Content-Type: application/json' \
          -H 'Accept: application/json' \
          -d "{\"branch\":\"${CIRCLE_BRANCH}\"}" \
          https://circleci.com/api/v2/project/github/${ORG}/${PROJECT}/pipeline
```

This feels like an incredible hack but it works.

## A side note on doing something when a PR is merged

This has nothing to do with CircleCI but if you happen to have access to GitHub actions this might be useful.

`.github/workflows/pr-closed.yml`

```yaml
name: On PR Closed

on:
  pull_request:
    types: [closed]

jobs:
  on-pr-closed:
    runs-on: ubuntu-latest
    steps:
      - name: Print PR number
        env:
          PR_NUMBER: ${{ github.event.number }}
        run: |
          echo "${PR_NUMBER}"
```
