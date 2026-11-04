---
title: Current agentic coding setup
date: "2026-11-04"
topics:
  - Agents & AI
description: My current setup for agentic coding.
---

I don't have anything special going on with my setup but I do like lists of tools to try out.

I can't believe it's only been a year since [I first wrote about my experiments with coding agents](https://ruarfff.com/posts/a-gaggle-of-agents).

For side projects and personal stuff, I have a completely wild and constantly changing array of tools. I'll talk about my work setup here since it's more consistent and I do get a decent amount done with it every day.

We use [GitHub Copilot](https://github.com/features/copilot) so this is tailored to that.

## Coding Harness

Generally [pi](https://pi.dev/) and [the copilot app](https://github.com/features/copilot).

I like working in the terminal and I prefer pi for that but the copilot desktop app has a lot of really nice features. Things like spawning subagents, setting up schedules, managing context are all pretty nice and visual in the app.

## Terminal Setup

I use [herdr](https://herdr.dev/) to manage my pi sessions. My pi sessions can also use herdr to spin up other herdr sessions. I love [tmux](https://tmux.app/) but the visual aspects of herdr work better for me.

I use [Ghostty](https://ghostty.org/) as my terminal emulator.

## Tools

### Interacting with agents

[Plannotator](https://github.com/backnotprop/plannotator) is a great tool and fun to use. I use it with pi to iterate on planning steps and for reviews. The copilot app has a built in review tool that is similar.

APM MCP (or whatever id available) - won't go into specifics about what we use but giving agents read access to your APM and any other observability is so useful both for debugging issues but also iterating on a design, identifying performance improvements, looking for error patterns and generally understanding how your app works beyond just the code.

### Reducing token usage

[RTK](https://github.com/rtk-ai/rtk) - quick setup proxy for cli commands to optimize output for agents.

[context-mode](https://github.com/mksglu/context-mode) - optimized token usage in tool use, so far seems to have the biggest impact for me but I haven't gathered enough data to say for sure yet.

[Headroom](https://github.com/headroomlabs-ai/headroom) - is a proxy between your harness and LLM api, reduce token usage by stripping out unnecessary context and other optimizations I haven't fully understood yet. I created a wrapper CLI [headroom-kit](https://github.com/ruarfff/headroom-kit) to help me use it with the copilot app and vscode. If you use nix [headroom-kit-nix](https://github.com/ruarfff/headroom-kit-nix).

## Skills

I find people sharing their skill stack like it's some kind of amazing thing a little cringe but maybe I should try them out more. I find iterating on my own skills for my own work a better experience in general but there are some handy skills out there that have saved me time. Here's what I've found useful so far:

- [Impeccable](https://impeccable.style/) for when I want the agent to make a UI nice, because I have no idea how to make a UI nice.
- [Ponytail](https://github.com/dietrichgebert/ponytail), I have my own "prepare-pr" skill that uses this to spin up a code review agent, it seems to do a pretty good job of making the code less yuck.
- [herdr](https://herdr.dev/tui/docs/agent-skill/) I mentioned already but it's a neat skill for getting agents to spin up herdr sessions and interact with other agents that way.
- [gh-stack](https://github.com/github/gh-stack/tree/main/skills/gh-stack) to tell the agent how to setup a PR stack when trying to break one change down into smaller PRs. (I still often read the code and we still do PRs so this is handy).
- [grill-with-docs](https://github.com/mattpocock/skills/tree/main/skills/engineering/grill-with-docs), occasionally use this when I absolutely want to torture myself and think about every possible scenario that could come up for a given problem. I usually throw away the docs afterwards but it has helped a few times to do this process.
- [show-me](https://www.humanlayer.com/blog/show-me-skill) to get the agent to explain things visually to me, useful in loads of places including concise PR messages. There are related skills like [caveman](https://github.com/JuliusBrussee/caveman/blob/main/skills/caveman/SKILL.md) and [bro](https://github.com/luchasarie/bro-skill) but I haven't found a need to try them yet.

If you use nix, I created a plugin to manage my skills [skillset-nix](https://github.com/ruarfff/skillset-nix). The problem it solves is making it easier to vendor skills and do some basic security scanning so you don't have to nxp install them. It also gives me a way to manage my own custom skills alongside third-party ones.

## General tips that save me time

When getting an agent to diagnose something I ask it to use the [5 whys](https://en.wikipedia.org/wiki/Five_whys) technique. I's annoyingly effective.

Use schedules a lot. If you find you are having to check on things, get the agent to push to you instead. Copilot app support this by you just asking it to schedule something, e.g. "let me know then this PR build passes".

Use static analysis and other deterministic checks more and optimize them for agent use. For example, here's a pre-commit plugin I setup https://github.com/ruarfff/anti-slop-python to catch a lot of common issue I see when working with coding agents. The output is text telling the agent what to do instead.

Those last two are thing you do when trying to build "loops" or graphs or whatever they're being called these days. Automating as much of the workflow as possible is not agentic coding specific, we've always done that and it does really help.
