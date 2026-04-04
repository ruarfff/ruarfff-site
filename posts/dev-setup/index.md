# My Dev Env setup

## Main setup 

Mac version:
```bash
# Install Homebrew (if needed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

brew install --cask ghostty

brew install --cask nikitabobko/tap/aerospace

# Install everything you actually need
brew install chezmoi gh fzf eza bat ripgrep starship git-delta fd tmux fastfetch stern make gnupg age pinentry-mac mise jj hl

# Install ONLY the zsh plugins you need (no oh-my-zsh!)
git clone https://github.com/zsh-users/zsh-autosuggestions ~/.zsh/zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-syntax-highlighting ~/.zsh/zsh-syntax-highlighting
```

Linux version:

```
sudo apt update
```




```bash
chezmoi init 
# This creates: ~/.local/share/chezmoi/
```

## Ghostty setup


/Users/obrirua/Library/Application Support/com.mitchellh.ghostty/config

```toml
theme = citruszest
font-family = "MonoLisa"
font_size = 17
font-feature = +liga +calt 
font-thicken = true

cursor-style = block # More visible than beam 
cursor-style-blink = false # Less distracting

renderer = metal 
scrollback-limit = 100000 # More history

# Theme: Catppuccin Mocha (high contrast, smooth on eyes)
palette = "catppuccin-mocha"

# Ergonomics
window-padding-x = 12
window-padding-y = 12

keybind = cmd+k=clear

```

starship

```toml
# ~/.config/starship.toml
add_newline = false
palette = "catppuccin-mocha"
format = """
$directory$git_branch$git_state$git_status$nodejs$python$kubernetes$cmd_duration$line_break$character
"""

[directory]
style = "bold lavender"
truncation_length = 3
truncate_to_repo = true

[git_branch] 
style = "purple bold" 
symbol = " "

[git_status] 
style = "red" 
ahead = "⇡${count}" 
diverged = "⇕" 
modified = "!${count}"

[kubernetes]
symbol = "☸️ "
format = "[$symbol $context](bold blue) "
disabled = false

[python]
symbol = "🐍 "
style = "bold green"
format = "[$symbol$version]($style) "

[nodejs]
symbol = "⬢ "
style = "bold yellow"
format = "[$symbol$version]($style) "

[time]
disabled = false
format = "🕒 [$time](bold gray) "
time_format = "%H:%M"

[character]
success_symbol = "[❯](bold green)"
error_symbol = "[❯](bold red)"



```

gitignore

```bash
.DS_Store
*ignore/
*.ignore.*
.venv/
.pytest_cache/
```

git config

```bash
[user]
  name = "Ruairí O'Brien"
  email = 1150322+ruarfff@users.noreply.github.com

[core]
  pager = delta
  excludesfile = ~/.gitignore
  
[push]
  default = simple

[interactive]
  diffFilter = delta --color-only

[delta]
  navigate = true
  side-by-side = true
  line-numbers = true

[diff]
  colorMoved = default
  mnemonicprefix = true
  
[init]
  defaultBranch = main
  
[branch]
  autosetuprebase = always

[filter "lfs"]
  clean = git-lfs clean -- %f
  smudge = git-lfs smudge -- %f
  process = git-lfs filter-process
  required = true
  
[alias]
  # list all aliases
  la = "!git config -l | grep alias | cut -c 7-"
  co = checkout
  st = status -s
  cm = commit -m
  d = diff --word-diff
  dlc = diff --cached HEAD^
  # Show verbose output about tags, branches or remotes
  tags = tag -l
  branches = branch -a
  remotes = remote -v
  rem="!git config -l | grep remote.*url | tail -n +2"
  # Pretty log output
  hist = log --graph --pretty=format:'%Cred%h%Creset %s%C(yellow)%d%Creset %Cgreen(%cr)%Creset [%an]' --abbrev-commit --date=relative
```

tmux

```bash
# Use Ctrl+A instead of Ctrl+B (easier to type)
unbind C-b
set -g prefix C-a
bind C-a send-prefix

# Vim-style pane navigation
bind h select-pane -L
bind j select-pane -D
bind k select-pane -U
bind l select-pane -R

# Split panes with | and -
bind | split-window -h
bind - split-window -v

# Enable mouse
set -g mouse on

# Start windows at 1, not 0
set -g base-index 1
setw -g pane-base-index 1

# Renumber windows when one is closed
set -g renumber-windows on

# Colors
set -g default-terminal "screen-256color"
set -ga terminal-overrides ",*256col*:Tc"

# Status bar
set -g status-style bg=default,fg=white
set -g status-left "[#S] "
set -g status-right "%H:%M %d-%b"
```

zshrc

```bash
eval "$(atuin init zsh)"
eval "$(starship init zsh)"
eval "$(zoxide init zsh)"


# Plugins
source ~/.zsh/zsh-autosuggestions/zsh-autosuggestions.zsh 
source ~/.zsh/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh

# History
HISTFILE=~/.zsh_history
HISTSIZE=50000 
SAVEHIST=50000 
setopt SHARE_HISTORY 
setopt HIST_IGNORE_ALL_DUPS 
setopt HIST_IGNORE_SPACE


# General ergonomics
setopt AUTO_CD
setopt HIST_IGNORE_DUPS
alias ls='ls -G'
alias ll='ls -lhG'
alias k='kubectl'
alias g='git'
alias ls="eza --icons --group-directories-first" 
alias ll="eza -la --icons --group-directories-first" 
alias cat="bat" 
alias grep="rg"
alias ..="cd .." 
alias ...="cd ../.." 
alias dev="cd ~/dev"

# Optional colorized output
autoload -U colors && colors
export LSCOLORS=ExFxBxDxCxegedabagacad
export CLICOLOR=1

# fzf setup 
source <(fzf --zsh) 
export FZF_DEFAULT_COMMAND='fd --type f --hidden --follow --exclude .git' 
export FZF_CTRL_T_COMMAND="$FZF_DEFAULT_COMMAND" 
export FZF_DEFAULT_OPTS=' 
	--height 60% 
	--layout=reverse 
	--border 
	--preview "bat --color=always {}" 
'

# Other tools

export PATH="$HOMEBREW_PREFIX/opt/make/libexec/gnubin:$PATH"
export PATH="$PATH:$HOME/.dotnet/tools"

```


```bash
echo "fastfetch" >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```


fzf and zoxide

```bash
brew install fzf zoxide
$(brew --prefix)/opt/fzf/install  # installs keybindings and completion



# fzf keybindings
[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh

# zoxide integration
eval "$(zoxide init zsh)"
alias cd='z'  # optional: replaces cd entirely

```





kubectl logs $(kubectl get pods | fzf)


export FZF_DEFAULT_OPTS="
  --color=bg+:#1e1e2e,bg:#11111b,spinner:#f5e0dc,hl:#f38ba8
  --color=fg:#cdd6f4,header:#f38ba8,info:#cba6f7,pointer:#f5e0dc
  --color=marker:#b4befe,fg+:#cdd6f4,prompt:#89b4fa,hl+:#f38ba8
  --layout=reverse --border --height=80%
"

