# My Dev Env setup

I keep all my dotfiles and development configurations in sync across my personal Mac, my work Mac, and my Linux virtual machines using [Chezmoi](https://www.chezmoi.io/) and a GitHub repository.

Here is exactly how I set up a new machine, followed by a breakdown of the configurations themselves.

## 1. Setting up a New Machine

### On macOS

1. **Install Homebrew** (if not already installed):
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Install Chezmoi and essential tools**:
   ```bash
   brew install chezmoi gh fzf eza bat ripgrep starship git-delta fd tmux fastfetch stern make gnupg age pinentry-mac mise jj hl
   ```

3. **Install GUI Apps** (macOS only):
   ```bash
   brew install --cask ghostty
   brew install --cask nikitabobko/tap/aerospace
   ```

### On Linux (Ubuntu/Debian)

1. **Update and install basics**:
   ```bash
   sudo apt update && sudo apt install -y curl git zsh tmux
   ```

2. **Install Chezmoi**:
   ```bash
   sh -c "$(curl -fsLS get.chezmoi.io)"
   ```
   *(Note: You may need to install the other CLI tools using `apt` or by installing Homebrew for Linux).*

### Universal Setup Steps (All OSs)

1. **Apply Dotfiles via Chezmoi**:
   Initialize and apply your dotfiles straight from GitHub (assuming your dotfiles repo is `ruarfff/dotfiles`):
   ```bash
   chezmoi init --apply ruarfff
   ```

2. **Install Zsh Plugins** (no oh-my-zsh needed):
   ```bash
   mkdir -p ~/.zsh
   git clone https://github.com/zsh-users/zsh-autosuggestions ~/.zsh/zsh-autosuggestions
   git clone https://github.com/zsh-users/zsh-syntax-highlighting ~/.zsh/zsh-syntax-highlighting
   ```

3. **Install Fonts**:
   I use [Departure Mono](https://departuremono.com/) for my terminal. Download the `.otf` or `.ttf` files from the website and install them (e.g. double-click on macOS, or move to `~/.local/share/fonts` on Linux).

4. **Change default shell to Zsh** (if not already):
   ```bash
   chsh -s $(which zsh)
   ```

---

## 2. Reference Configurations

Here is what is inside those dotfiles being pulled down by Chezmoi:

### Ghostty (`~/.config/ghostty/config`)

```toml
theme = Citruszest
font-family = "Departure Mono"
font-size = 18
font-feature = +liga +calt 
font-thicken = true

cursor-style = block
cursor-style-blink = true
cursor-color = "#ff00ff"
cursor-text = "#000000"

scrollback-limit = 100000

# Ergonomics
window-padding-x = 12
window-padding-y = 12
window-height = 40
window-width = 120
```

### Starship (`~/.config/starship.toml`)

```toml
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

### Git Config (`~/.gitconfig`)

Uses `delta` for a vastly improved `git diff` experience.

```ini
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

### Tmux (`~/.config/tmux/tmux.conf`)

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

### Zsh (`~/.zshrc`)

```bash
eval "$(atuin init zsh --disable-up-arrow)"
bindkey '^[[A' up-line-or-search
bindkey '^[[B' down-line-or-search

eval "$(starship init zsh)"
eval "$(zoxide init zsh)"
eval "$(mise activate zsh)"

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
alias k='kubectl'
alias g='git'
alias ls="eza --icons --group-directories-first" 
alias ll="eza -la --icons --group-directories-first" 
alias cat="bat" 
alias grep="rg"
alias ..="cd .." 
alias ...="cd ../.." 
alias dev="cd ~/dev"
alias cd='z'

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
  --color=bg+:#1e1e2e,bg:#11111b,spinner:#f5e0dc,hl:#f38ba8
  --color=fg:#cdd6f4,header:#f38ba8,info:#cba6f7,pointer:#f5e0dc
  --color=marker:#b4befe,fg+:#cdd6f4,prompt:#89b4fa,hl+:#f38ba8
'

# Other tools
export PATH="$HOMEBREW_PREFIX/opt/make/libexec/gnubin:$PATH"
export PATH="$PATH:$HOME/.dotnet/tools"
export PATH="$HOME/.local/bin:$PATH"

function maintain() {
    echo "--- Updating Homebrew ---"
    brew update && brew upgrade && brew cleanup
    
    echo "--- macOS System Updates ---"
    softwareupdate -i -a
    
    echo "--- Other Updates ---"
    go install github.com/steveyegge/gastown/cmd/gt@latest
    go install github.com/steveyegge/beads/cmd/bd@latest
    echo "--- Done ---"
}
```

### Profile (`~/.zprofile`)

```bash
eval "$(/opt/homebrew/bin/brew shellenv zsh)"
export PATH="$PATH:/Applications/Obsidian.app/Contents/MacOS"

fastfetch
```

### Gitignore (`~/.gitignore`)

```bash
.DS_Store
*ignore/
*.ignore.*
.venv/
.pytest_cache/
```