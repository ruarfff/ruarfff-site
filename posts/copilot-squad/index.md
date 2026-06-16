---
title: Copilot Squad
description: There are two sections to this. In the first section, I discuss what squad is, why it might be useful...
date: "2026-05-05"
---

There are two sections to this. In the first section, I discuss what [squad](https://bradygaster.github.io/squad/) is, why it might be useful to learn and
share a few thoughts on agentic coding in general. The second section is a simple tutorial on getting started with squad with some setup I recommend. If you just want to learn about Copilot Squad, feel free to skip to [the second section](#squad-tutorial).

## Squad and Agentic Coding

![Ronnie Coleman Meme talking about markdown files](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/e5cinyyn8ymth2vmbi6x.jpg)

Coding is solved, apparently. If you're a software engineer and you've been using coding agents for a while,
you may be noticing you're working harder than ever despite the promise of AI doing it all.

The work has certainly changed. For most code changes, it's easier just to ask an agent to do it and you might even worry you're going too slow if you don't.

For a lot of us, coding used to be an enjoyable thing. You would spend a lot of time making code clean. You wanted it to be nice
for future you to work with. You wanted others to think your code was good too. Despite that, most of us complained we hardly got to spend enough time coding.

[Amdahl's law](https://en.wikipedia.org/wiki/Amdahl%27s_law) says
> "the overall performance improvement gained by optimizing a single part of a system is limited by the fraction of time that the improved part is actually used."

So if we're only generating code with AI, we're only speeding up one relatively small part of the job. If you don't care about quality, it can feel
like you've achieved massive productivity levels. If you're experienced and understand what maintaining quality software is actually like, you'll know that feeling is a lie. 

Agents don't care. They don't learn. They don't need code to look nice for future them. Agents don't get that horrible fear when they realize they just caused a massive incident or feel the weird shame of a postmortem.

If you're working an actual job, you can't just vibe code and YOLO all your work. At least, not for long.
Blaming the AI for bad work is a quick way to lose everyone's respect and trust.

Almost everyone in software is using coding agents. That's unlikely to change soon. While AI bros are a lot like crypto bros, AI utility and demand is not like crypto. It makes sense to figure out how to use this stuff instead of ignoring it and hoping it goes away.

So, is our job mostly writing detailed specs now? Like writing code but way worse? Then reviewing massive amounts of output and being on the hook for it?

There is a spectrum emerging where on the one hand, people advocate for a very limited and iterative approach to agentic coding like [Jeremy Howard's](https://en.wikipedia.org/wiki/Jeremy_Howard_(entrepreneur)) [SolveIt](https://solve.it.com/). This is a method where we use tooling to let agents help us write the code but we write most of it and focus on good architecture, keeping things as concise and comprehensible as possible. I love this approach but the tooling isn't there yet and it pushes up against the [tokenmaxxing](https://en.wikipedia.org/wiki/Token_maxxing) trend.

On the other extreme we've got things like [Gas Town](https://github.com/gastownhall/gastown) introduced by [Steve Yegge](https://en.wikipedia.org/wiki/Steve_Yegge) where you just let a swarm of agents rip, barely read code at all and focus on making that setup produce the desired outcomes. 

Both approaches are genuinely difficult if you are trying to do good work but they can also be very powerful. 

[Squad](https://bradygaster.github.io/squad/) is closer to the Gas Town model. I think it's a nicer starting point to ease into things, particularly if you use Copilot already. 

You can use the tools to help with planning, testing, reviewing etc. You still have to coordinate things but you can design agents to do some of the boring stuff. It doesn't solve all the problems. You still end up with more output that you can possibly fully review but you get a little more automation and reduced toil. 

## Squad Tutorial

I use [squad](https://bradygaster.github.io/squad/) at work, but not really on personal projects. We use Copilot at work, and squad fits nicely with it. However, I don't want to make others on the team learn or
adopt it so I don't want to commit squad specific stuff to our repos. This section describes how I am using squad and will hopefully have some useful lessons if you want to start playing around with it too.

Squad [already has good docs](https://bradygaster.github.io/squad/docs/get-started/five-minute-start/), and I don't intend to repeat much of that here.

You do need [squad](https://github.com/bradygaster/squad) and [Copilot CLI](https://github.com/features/copilot/cli) installed to follow along. Squad does require [NodeJS](https://nodejs.org/) to be installed too.

Squad is pretty simple to setup but it takes a bit of practice to see the benefits. It might help to go through an example. Let's say we have a project that interacts with OpenAI's API. We decide to go with a FastAPI backend because we
want to use some Python libraries (just making reasons up here), and then we have a React UI because that's what everyone is doing.

You can set up a basic React UI like this:

```console
❯ npx create-react-router@latest
Need to install the following packages:
create-react-router@7.14.2
         create-react-router v7.14.2
   dir   Where should we create your new project?
         ./my-react-ui

```

You can set up a basic FastAPI app like this:

```console
❯ mkdir my-fastapi-app
❯ cd my-fastapi-app
❯ uv init
Initialized project `my-fastapi-app`
❯ uv add fastapi

```

You now have a basic setup, but of course feel free to use any existing set of projects. I am just using these examples to illustrate. And yes, I know I could just get an agent to do all this for me but one of my pet hates these days is people pointing that out as if I couldn't possibly have thought of it.
Every time I hear "just get Copilot/claude/whatever to do it" I die a little inside.

If you only work on one repo, you could set squad up in that. If you work in a monorepo, even better. Most likely though, you just want to try squad out for a bit without wrecking a repo with loads of markdown configs. I suggest creating a dedicated squad directory to begin with rather than adding to an existing repo or having to gitignore a load of config files. This makes it easier to get started and it allows you to work across multiple repos more easily too.

```console
mkdir my-squad-workspace
cd my-squad-workspace

git init # Optional, but no harm putting version control in here
```

The next steps make sure you have Squad installed and set up the workspace:

```console
npm install --save-dev @bradygaster/squad-cli:latest
npx squad init
```

You should see something like this:

```console
❯ npx squad init

Let's build your team.

✓ .squad/casting/policy.json
✓ .squad/casting/registry.json
✓ .squad/casting/history.json
✓ .squad/config.json
✓ .squad/agents/scribe/charter.md
✓ .squad/agents/scribe/history.md
✓ .squad/agents/ralph/charter.md
✓ .squad/agents/ralph/history.md
✓ .squad/identity/now.md
✓ .squad/identity/wisdom.md
✓ .squad/ceremonies.md
✓ .squad/decisions.md
✓ .squad/team.md
✓ .squad/routing.md
✓ .copilot/skills
✓ .gitattributes
✓ .gitignore
✓ .github/agents/squad.agent.md
✓ .squad/templates
✓ .github/workflows/squad-heartbeat.yml
✓ .github/workflows/squad-issue-assign.yml
✓ .github/workflows/squad-triage.yml
✓ .github/workflows/sync-squad-labels.yml
✓ .copilot/mcp-config.json
✓ .gitignore
✓ .squad/.first-run

◆ SQUAD

  📁  Team workspace
  📋  Skills & ceremonies
  🔧  Workflows & CI
  🧠  Identity & wisdom
  🤖  Copilot agent prompt

Your team is ready. Run squad to start.

❯ ls -al
drwxr-xr-x@   - ruairi  4 May 21:02  .copilot
drwxr-xr-x@   - ruairi  4 May 21:02  .git
drwxr-xr-x@   - ruairi  4 May 21:02  .github
drwxr-xr-x@   - ruairi  4 May 21:02  .squad
.rw-r--r--@ 191 ruairi  4 May 21:02 󰊢 .gitattributes
.rw-r--r--@ 226 ruairi  4 May 21:02 󰊢 .gitignore

```

At this point, you have a basic squad that has no idea what it's supposed to be working on.

Squad is currently a Copilot tool, so you run it with Copilot or run it directly. Here, we will run it with Copilot:

```console
 copilot --agent squad --yolo
```

When Copilot starts up, you can add directories to the session. You can also add a workspace configuration so you don't have to run this each time, but we'll do it step by step here first.

In the Copilot interface, type:

```console
/add-dir /path/to/your/ui/project
/add-dir /path/to/your/fastapi/project
```

To automate this in the Squad workspace:

```console
touch .github/hooks/add-related-dirs.json

```

In that file, add something like (change paths as needed):

```json
  {
      "version": 1,
      "hooks": {
        "sessionStart": [
          {
            "type": "prompt",
            "prompt": "/add-dir ../my-react-ui"
          },
          {
           "type": "prompt",
           "prompt": "/add-dir ../my-fastapi-app"
         }
       ]
     }
   }

```

If you setup the hook, when you start squad you'll get an output like this:

```console
● Selected custom agent: Squad

● Added directory to allowed list: /Users/ruairi/dev/my-react-ui

● Added directory to allowed list: /Users/ruairi/dev/my-fastapi-app

● Environment loaded: 5 skills, 3 MCP servers, 1 plugin, 2 agents

● GitHub MCP Server: Connected

● Allowed directories for file access:

  1. /Users/ruairi/dev/my-squad-workspace
  2. /Users/ruairi/dev/my-react-ui
  3. /Users/ruairi/dev/my-fastapi-app
```

Technically, you don't really need to do this since you're running in YOLO mode. I just find it useful to prime the agents.
I find I don't need to remind the agent which directory we're supposed to be looking at.

### Build your team

You can go in and modify your squad configurations by hand, but your squad agent knows how to do that too.

For example, type this into the prompt:

```console
❯ Can you look at the projects in this workspace, the UI and FastAPI backend, and hire a team to work on these? 

We need a UI dev, a UI tester who can use Playwright, 
a backend Python FastAPI expert, and a lead generalist.
```

When you type in the chat, you're instructing your "team lead" or, at least, the agent that is supposed to get other agents to do things and to help you modify the squad configurations.

The agent will propose a team structure and ask for approval to hire them.

You can also ask for specific models for each agent, e.g. high end Opus for a planning agent, sonnet for a coder etc.

### GitHub issues

During the creation process, Squad will ask if there's a GitHub issue backlog to use. You should definitely use this. It's really handy to store this stuff in GitHub. 

You can get the agents to write all their analysis and planning and keep building on that. You can use one project as your backlog base or spread things out across multiple projects. The assumption here is that if you're using Squad, you're also using GitHub. These issues are for use by squad agents more so than other people.

### Ralph

Notice there's an agent called Ralph. This is a type of [Ralph Loop](https://ghuntley.com/loop/), which is basically a way to replace the annoying approval-and-prompt cycle we get into working with coding agents.

If you, like me, get frustrated with having to check in on agents all the time, this is a really nice feature once you get the hang of automating the checks around it.

In the Copilot chat with the Squad agent active, you can use Ralph to force extended interaction.

#### Hire a domain expert

It's useful to prime an agent with context about a domain. Once you get beyond the initial pleasantries with coding agents, you quickly get annoyed with how often you have to repeat yourself. A nice feature of squad, which you could obviously solve in many ways and subagents aren't new, is the idea of creating a specialist in a particular domain.

I will often "hire" a team member that has a specific set of skills. I'll tell it to be aware of certain code repositories and documentation. Then if any other agent, or I, have a question about that domain, we can ask that agent and get a concise response without blowing up our context windows.

We mentioned earlier that we'd integrate with the OpenAI API. We can ask Squad to hire a team member for that.

```console
 While we work on these projects, we will integrate with the OpenAI API. 
I need you to hire an OpenAI integration expert. 
They should be fully aware of the OpenAI API https://developers.openai.com/api/docs and the cookbook https://github.com/openai/openai-cookbook. 
We will be using the Python SDK https://github.com/openai/openai-python so they should be experts in that.
```

You will see some output and squad giving the new team member a name.

```console
● ✅ Verbal joined the team as OpenAI Integration Expert.

  They’re now wired into the roster, routing, squad:verbal issue label, casting registry, and decisions. Their charter explicitly points them at the
  OpenAI API docs, OpenAI Cookbook, and official openai-python SDK as required sources.

```

You can ask about your Squad:

```console
❯ Can you tell me about the squad?

● Your Squad is set up for a UI + Playwright + FastAPI + OpenAI workspace.

  ┌──────────────┬───────────────────────────┬─────────────────────────────────────────────────────────────────────────────┐
  │ Member       │ Role                      │ What they handle                                                            │
  ├──────────────┼───────────────────────────┼─────────────────────────────────────────────────────────────────────────────┤
  │ Keaton       │ Lead Generalist           │ Scope, architecture, cross-stack tradeoffs, reviews                         │
  ├──────────────┼───────────────────────────┼─────────────────────────────────────────────────────────────────────────────┤
  │ Fenster      │ UI Dev                    │ Frontend structure, components, styling, browser behavior                   │
  ├──────────────┼───────────────────────────┼─────────────────────────────────────────────────────────────────────────────┤
  │ Hockney      │ UI Tester                 │ Playwright E2E tests, browser workflows, UI regression coverage             │
  ├──────────────┼───────────────────────────┼─────────────────────────────────────────────────────────────────────────────┤
  │ McManus      │ FastAPI Backend Expert    │ Python FastAPI routes, schemas, validation, backend services                │
  ├──────────────┼───────────────────────────┼─────────────────────────────────────────────────────────────────────────────┤
  │ Verbal       │ OpenAI Integration Expert │ OpenAI API, Cookbook-informed patterns, official Python SDK integration     │
  ├──────────────┼───────────────────────────┼─────────────────────────────────────────────────────────────────────────────┤
  │ Scribe       │ Session Logger            │ Decisions, orchestration logs, team memory                                  │
  ├──────────────┼───────────────────────────┼─────────────────────────────────────────────────────────────────────────────┤
  │ Ralph        │ Work Monitor              │ Backlog/issues/PR monitoring and keep-alive work queue                      │
  ├──────────────┼───────────────────────────┼─────────────────────────────────────────────────────────────────────────────┤
  │ @copilot     │ Coding Agent              │ Autonomous issue work for clear, isolated tasks; auto-assignment is enabled │
  └──────────────┴───────────────────────────┴─────────────────────────────────────────────────────────────────────────────┘

  Routing is also wired: OpenAI work goes to squad:verbal, backend to McManus, UI to Fenster, Playwright to Hockney, architecture/review to Keaton, and
  suitable autonomous GitHub issues to squad:copilot.
```

### Working with your Squad

#### Building features

I'm not going to go into a huge amount of detail here or show detailed examples as I don't think there's much value in it. You really just have to see it for yourself.

There's no harm in starting out like you would with a standard coding agent. Ask for small changes here and there. Get a feel for it.

Where things get interesting, I think, is when you try to plan out features or debug issues.

You can give a high-level overview of a feature you want and ask squad to build a proposal in a GitHub issue. You can review the issue, tweak it, and once you're happy, tell Squad to break it down into tasks. Once that's ready, you can ask Ralph to iterate on the feature until it's done. The Ralph loop should check work, give feedback and keep going until it's happy it met the requirements.

This is still just LLMs and prone to making a complete mess of things, but this iteration approach is surprisingly powerful.

#### Debugging issues

When prompting Squad, if you use the word "team", you're indicating that you want multiple agents to work on something rather than calling out a specific agent.

I find it really useful, if I'm stuck on some issue, to get the Squad to look into it with me. I'll ask it to create a GitHub issue, or I'll tell it to work on one I created and track all the investigation in there.

The top-level coordinator will assign other agents to go investigate specific parts of the problem and come back with their findings. This can speed things up a bit and keep the chat context more focused.

I'll write a prompt like:

```console
Team. Our API integrates with this API <GitHub link to API code or API docs>. 
We're seeing this production issue: <error logs and whatever context makes sense>. Use this GitHub issue <link to issue>.
Analyze the error, report your findings, and propose a fix based on what you know of our code and the code we're integrating with.
```

It doesn't always work, but it can generally very quickly gather a decent amount of relevant information together to help solve things. Often it just solves the issue.

## Conclusion

There are so many coding agent tools out there. You likely end up building your own too. It's fairly easy to do that. Coding agents like [PI](https://pi.dev/) are designed for that.

I've found Squad to be a nice example of interesting and useful patterns, particularly when using Copilot at work. It's easy to use, relatively efficient, and I've found it saves me a bit of time. It's been a good addition to the toolset.

