---
title: My Dev Tool List 2025
date: "2025-12-02"
description: The tools I use for development in 2025
---

## TL;DR

On Mac:

```shell
brew install --cask nikitabobko/tap/aerospace

brew install atuin chezmoi gh fzf eza bat ripgrep starship git-delta fd tmux stern mise jj hl
```

On Linux with apt:

```shell
sudo apt install -y \
  fzf \
  fd-find \
  ripgrep \
  bat \
  tmux

# eza (modern ls)
sudo apt install -y gpg
sudo mkdir -p /etc/apt/keyrings
wget -qO- https://raw.githubusercontent.com/eza-community/eza/main/deb.asc | sudo gpg --dearmor -o /etc/apt/keyrings/gierens.gpg
echo "deb [signed-by=/etc/apt/keyrings/gierens.gpg] http://deb.gierens.de stable main" | sudo tee /etc/apt/sources.list.d/gierens.list
sudo apt update && sudo apt install -y eza

# delta (git pager)
DELTA_VERSION="0.18.2"
wget https://github.com/dandavison/delta/releases/download/${DELTA_VERSION}/git-delta_${DELTA_VERSION}_amd64.deb
sudo dpkg -i git-delta_${DELTA_VERSION}_amd64.deb
rm git-delta_${DELTA_VERSION}_amd64.deb

# mise (version manager)
curl https://mise.run | sh

# jj (Jujutsu)
curl -LsSf https://github.com/jj-vcs/jj/releases/latest/download/jj-x86_64-unknown-linux-musl.tar.gz | tar xzf - -C ~/.local/bin jj

# gh (GitHub CLI)
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list
sudo apt update && sudo apt install -y gh

# Setup chezmoi and pull your dotfiles
sh -c "$(curl -fsLS get.chezmoi.io)" -- init --apply YOUR_GITHUB_USERNAME
```

## [AeroSpace](https://github.com/nikitabobko/AeroSpace) window manager for macOS

It angers me how much time I wasted dragging things around the screen before. If you use a mac, give it a try.

```shell
brew install --cask nikitabobko/tap/aerospace
```

## [Atuin](https://atuin.sh) modern shell history

Sync your shell history across devices. Only useful if you're working on multiple machines, which I do and this is extremely useful.

```shell
brew install atuin
echo 'eval "$(atuin init zsh)"' >> ~/.zshrc
```

[Atuin](https://atuin.sh) also comes with a pretty [cool desktop app](https://cdn.crabnebula.app/download/atuin/atuin-desktop/latest/platform/dmg-aarch64) which I love the idea of but have yet to do anything useful with.


## [Chezmoi](https://www.chezmoi.io) dotfile and config sync

I regularly work on at least 3 different machines. This makes everything way easier to keep in sync and is a lot better than the custom git setup I made a few times.

```shell
brew install chezmoi

chezmoi init

chezmoi add ~/.bashrc # or .zshrc or whatever
```

## [GitHub CLI](https://cli.github.com)

Obviously, if you use GitHub. Makes everything way easier.

```shell
brew install gh
```

Example, creating a new repo:

```shell
gh repo create cool-repo --public --source=. --remote=origin
```

## [fzf](https://github.com/junegunn/fzf) fuzzy finder cli

When you've got bad memory and can't type, like me, this is a very useful tool.

```shell
brew install fzf
```

Then you can use Ctrl-R to search.

## [eza](https://github.com/eza-community/eza) modern ls replacement

A common theme is I like colours and icons, particularly in the terminal. eza is a modern replacement for ls with all that built in.

```shell
brew install eza
```

## [bat](https://github.com/sharkdp/bat) a cat clone with syntax highlighting and git integration

Cat a file and see colours. Also shows git changes inline.

```shell
brew install bat
```

I alias `cat` to `bat`. You can do this with [atuin's dotfile sync](https://docs.atuin.sh/guide/dotfiles/) if you're using that:

```shell
atuin dotfiles alias add cat bat
```

## [ripgrep](https://github.com/BurntSushi/ripgrep) fast grep replacement

Something so impressively fast you can't help but use it.


```shell
brew install ripgrep
```

## [starship](https://starship.rs) cross-shell prompt

I just like the colours and things. Spent too much time configuring it maybe but I like it.

```shell
brew install starship
```

## [git-delta](https://dandavison.github.io/delta/) git pager with syntax highlighting and side-by-side diffs

 If you use git diff a lot, this will save your eyes.

```shell
brew install git-delta
```

Update your `~/.gitconfig`:

```ini
[core]
    pager = delta

[interactive]
    diffFilter = delta --color-only

[delta]
    navigate = true    # use n and N to move between diff sections

    # delta detects terminal colors automatically; set one of these to disable auto-detection
    # dark = true
    # light = true

[merge]
    conflictStyle = zdiff3
```

## [fd](https://github.com/sharkdp/fd) find replacement

I have never remembered the correct arguments for `find`. This is a modern replacement that I like.

```shell
brew install fd
```

e.g. from the docs:

```shell
> cd /etc
> fd '^x.*rc$'
X11/xinit/xinitrc
X11/xinit/xserverrc
```

 ## [tmux](https://github.com/tmux/tmux/wiki) terminal multiplexer

 It took me way too long to get on the tmux train. What was I even doing before?

 ```shell
brew install tmux
```

```shell
# Start a session in a directory
tmux new-session -d -s my-session -c ~/some-dir

# Attach to session
tmux attach -t my-session
```

Leave ssh sessions, or anything really, running in the background and come back to them later.

## [stern](https://github.com/stern/stern) multi-pod log tailing for Kubernetes

The amount of times I've opened a bunch of terminal windows trying to tail logs in a multi instance setup. This is much easier than any of the hacky solutions I came up with before.

```shell
brew install stern
```

## [mise](https://mise.jdx.dev) version manager for CLI tools

I was a chef briefly in a past life so the name speaks to me. This is a tool like nvm, pyenv etc. but supports a collection of CLI tools.

```shell
brew install mise
```

Example installing python 3.14 globally:
```shell
mise use --global python@3.14
```

## [jj](https://github.com/jj-vcs/jj) a version control system that works with git

This is the most recent addition for me. I don't know why I like it yet. I just know I do.

```shell
brew install jj
```

Setting it up in an existing git repo:

```shell
jj git init --colocate
```

## [hl](https://github.com/pamburus/hl) high-performance log viewer

No more getting wrekt by huge log files.

```shell
brew install hl
```

```shell
hl /path/to/huge/logfile.log

# or many log files
hl /path/to/logs/*.log
```

## [lazyvim](https://www.lazyvim.org) Neovim config

I'm forever trying to use vim and then giving up, falling back to VSCode. I think this one is starting to stick.

## Coding Agents

Of course. Wrote a detailed post about how I'm using those: <https://ruarfff.com/posts/a-gaggle-of-agents>