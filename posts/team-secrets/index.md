---
title: Managing local app secrets and sharing secrets with your team
date: "2021-01-11"
description: Storing application secrets locally in plain text can be risky and lead to them being accidentally committed to repositories. Sharing secrets across a team can be a pain too. This post describes one solution that could help.
---

In this article I will be discussing a tool called [pass](https://www.passwordstore.org/). This article assumes you use a Unix style shell for development, so working on Mac, Linux, WSL or similar.

## TL;DR

[Command Summary](#command-summary)

## Contents

- [Why Pass?](#why-pass)
- [Secrets While Developing](#secrets-while-developing)
- [A Sample App](#a-sample-app)
- [Using Pass to Help With Local Development](#using-pass-to-help-with-local-development)
- [Backing Up Secrets](#backing-up-secrets)
- [Adding a Team Member](#adding-a-team-member)
- [Removing a Team Member](#removing-a-team-member)
- [Conclusion](#conclusion)
- [Command Summary](#command-summary)

## Why Pass? <a name="why-pass"></a>

Why use [pass](https://www.passwordstore.org/) and not some other tool like [1password](https://1password.com), [Dashlane](https://www.dashlane.com) and others which maybe have more features and better platform support?

Pass is free, open source and works on most systems that developers use. The ability to use it in your terminal and make it part of the workflow makes it a great tool for developers. If your company does pay for one of the other tools though, they might be a better choice for you. If not, `pass` is a great option.

## Secrets While Developing <a name="secrets-while-developing"></a>

If you are building some software that talks to other software, there's a good chance you are reading secrets in your code. If you are calling services with something like [curl](https://curl.se) you likely input commands similar to `curl -H "Authorization: token my-super-secret-token" https://some-auth-needing-service.com` into your terminal.

If you work in a team and you have some development credentials your team uses, you have probably encountered issues with sharing and keeping track of those secrets.

In this post we will look at [pass](https://www.passwordstore.org/) as an option to help with this. We will look at a potential local workflow that uses `pass` so you don't ever need to store secrets in plaintext locally. Then we will look at how to share these secrets with your team in a way that's reasonable enough to maintain.

The next section will show a sample app to test out the methods we will use but feel free to skip that section if you don't need to use a sample app.

## A Sample App <a name="a-sample-app"></a>

We will use an app based on backstage.

<https://github.com/backstage/backstage>

This is a useful example as we can configure it to use GitHub auth to allow users to login and interact with GitHub. The actual sample app for this is here:

<https://github.com/ruarfff/backstage-example>

By default this example app is expecting 3 environment variables to exist.

`GITHUB_TOKEN `
`AUTH_GITHUB_CLIENT_ID`
`AUTH_GITHUB_CLIENT_SECRET`

They are referenced in the application configuration here:

[GITHUB_TOKEN](https://github.com/ruarfff/backstage-example/blob/2ebd761ce316384f15165b506ce50ed67afa0515/app-config.yaml#L27)

[AUTH_GITHUB](https://github.com/ruarfff/backstage-example/blob/2ebd761ce316384f15165b506ce50ed67afa0515/app-config.yaml#L53-L56)

If you were deploying this to production you might use some kind of [vault](https://www.vaultproject.io), [kube secrets](https://kubernetes.io/docs/concepts/configuration/secret/) or something of that nature to load these into the environment. We won't look at that here. Instead we will look at what you would do it you needed to get this running locally and wanted to use a development GitHub setup for it. Similar methods would apply to a broad range of problems like this.

If you try to run the application you'll get an error (a lot of unimportant output left out in the following example):

```
git clone git@github.com:ruarfff/backstage-example.git
cd backstage-example
yarn
yarn dev

[1] Backend failed to start up, Error: Failed to initialize github auth provider, Missing required config value at 'auth.providers.github.development.clientId'
```

To create secrets and follow along you will need a GitHub account. Go here https://github.com/settings/applications/new

Fill it in like this:

![Register OAuth App](./1-gh-auth.png)

The local UI for the app is:

`http://localhost:3000`

The backend runs locally on port 7000 and the callback URL for it is:

`http://localhost:7000/api/auth/github/handler/frame`

On the next page generate a new client secret. Make note of the client id and the secret.

You'll need a token for creating repositories. Go here https://github.com/settings/tokens/new

Creating a token that can work with repositories should be enough to test things out:

![Create Token](./2-token.png)

Take note of the token.

How did you take note of those secrets? Are they secret? Are they safe? Hopefully you have a good way of storing secrets already. If you aren't using `pass`, the next section will take a look at that and maybe you'll also consider it a useful tool for this kind of thing.

## Using Pass to Help With Local Development <a name="using-pass-to-help-with-local-development"></a>

Install pass. I am on mac so did:

```
brew install pass
```

For Debian it's:

```
sudo apt-get install pass
```

See the [pass site](https://www.passwordstore.org/) for instructions about installing on other platforms.

Now we will set up a [gpg](https://gnupg.org) key. This is what we will use for encryption in pass. I found [this article](https://sanctum.geek.nz/arabesque/gnu-linux-crypto-gnupg-keys/) good for learning more about gpg.

Now pick a good passphrase. From now on I will refer to that as `$PASSPHRASE`. You will be asked to enter it while creating your key.

```
gpg --gen-key
```

Check the key:

```
gpg --list-keys
```

You should see something like:

```
/you/.gnupg/pubring.kbx
----------------------------------------------------
pub   rsa3072 2020-11-02 [SC] [expires: 2022-11-02]
      AB3A5ED268BD87CD06F8F30B6881F49AF5BB8EAD
uid           [ultimate] you <you@email.com>
sub   rsa3072 2020-11-02 [E] [expires: 2022-11-02]
```

Now copy the ID for that key. In the example above the ID is `AB3A5ED268BD87CD06F8F30B6881F49AF5BB8EAD`. From now on we will refer to that as `$GPG_KEY`.

Now we will setup pass. Note, by default pass uses `~/.password-store`. If you want to keep your personal password store and your team one separate, you can configure separate directories.

The directory pass uses can be configured like so:

```
export PASSWORD_STORE_DIR=~/.work-password-store
```

Example of an alias to use:

```
alias workpass='PASSWORD_STORE_DIR=~/.work-password-store pass'
```

If you decide to use an alias, replace `pass` with `workpass` (or whatever alias you setup) in all the following examples.

Initialise pass:

```
pass init $GPG_KEY
```

Earlier, if you followed along, you created a GitHub token. Save the token with pass like so:

```
pass insert GitHub/backstage-example-token
Enter password for GitHub/backstage-example-token:
```

You can get the token back again:

```
pass GitHub/backstage-example-token
```

You will be prompted for a password the first time when reading a value from pass and again after the login times out.

Use the token, extracting from pass, like this:

```
curl -H "Authorization: token $(pass GitHub/backstage-example-token)" -H "Accept: application/vnd.github.v3+json" https://api.github.com/user/repos
```

One advantage of this approach is you do not have to store the token in plaintext at any point or have it visible on your screen as you use the terminal. If you type `history` you won't see any record of the password.

In our example application we need 2 more secrets.

```
pass insert GitHub/backstage-example-client-id
```

```
pass insert GitHub/backstage-example-client-secret
```

There's a lot of ways you could use these secrets now to run our sample app. I propose this one. Add a file somewhere on your machine or even in the repo with this content:

```
export GITHUB_TOKEN="$(pass GitHub/backstage-example-token)"
export AUTH_GITHUB_CLIENT_ID="$(pass GitHub/backstage-example-client-id)"
export AUTH_GITHUB_CLIENT_SECRET="$(pass GitHub/backstage-example-client-secret)"
```

In the following example I assume you created a file in the project directory with that content. Now run:

```
source secrets && yarn dev
```

All going well, you should have a login page:

![Backstage login](./3-oauth-app.png)

![GitHub OAuth popup](./4-popup.png)

![Logged in](./5-backstage.png)

## Backing Up Secrets <a name="backing-up-secrets"></a>

I did make a comment earlier that you shouldn't store secrets in a git repo (even a private one) but it can be OK to store encrypted secrets in one. As long as you don't store the key along with it of course. Pass does store structural data like the name of the secret so be aware of that when using with git. **The secrets are encrypted but the names are not**.

For this next step you should have a remote git repository you feel comfortable using to backup encrypted secrets.

Type:

```
pass git init
```

Add an origin as in this example:

```
pass git remote add origin git@github.com:you/your-pass.git
```

To sync all those secrets we created already do:

```
pass git push -u --all
```

For subsequent updates do:

```
pass git push
```

You should now see the encrypted secrets up in the repo.

Here's an example in a temporary GitHub repo I created for this:

![Secrets backed up](./6-repo.png)

## Adding a Team Member <a name="adding-a-team-member"></a>

For now let's assume you want to share that secret store we just created with another team member. We will go through each step required to allow that. It's a bit tedious but only needs to be done once per team member. We will look at adding members as readonly and as read/write.

### Readonly

For a new team member to get setup they must:

- Setup a gpg key
- Export and send the public key to you
- Install pass

Then you must:

- Trust their key
- Re-encrypt the store with the new key
- Push the updated store to the git repo

Then they must:

- Clone the pass store (or pull down the updates if they cloned already)

### Tutorial of those steps

Assuming our new team member has already generated a key, they will run:

```
gpg --list-keys
```

```
/your-colleague/.gnupg/pubring.kbx
----------------------------------------------------
pub   rsa3072 2020-11-02 [SC] [expires: 2022-11-02]
      C351DB397FDFFD4499AB760435C0B93754D6ACD0
uid           [ultimate] your-colleague <your-colleague@email.com>
sub   rsa3072 2020-11-02 [E] [expires: 2022-11-02]
```

They must copy the ID for the key to export it as in this example:

```
gpg --export --armor C351DB397FDFFD4499AB760435C0B93754D6ACD0 > pass-publickey.asc
```

Now they must send the key file to you. It is reasonably safe to send a public key over email or chat but if you have a secure way to share the key, even better.

Next they can clone the store. This example clones to the default password store directory:

```
git clone git@github.com:you/your-pass.git ~/.password-store
```

If the team member already uses pass or wants to keep the team and personal stores separate, they can use the method we looked at before:

```
git clone git@github.com:you/your-pass.git ~/.work-password-store

alias workpass='PASSWORD_STORE_DIR=~/.work-password-store pass'
```

At this point they will be able to list the secrets but not read them:

```
pass
Password Store
├── GitHub
│   ├── backstage-example-client-id
│   ├── backstage-example-client-secret
│   └── backstage-example-token
```

The next step is done on your machine.

Assume your team members sent you their public key in a file called `pass-publickey.asc`:

```
gpg --import pass-publickey.asc

gpg --list-keys
```

You should see an output with something similar to this:

```
/you/.gnupg/pubring.kbx
----------------------------------------------------
pub   rsa3072 2020-11-02 [SC] [expires: 2022-11-02]
      AB3A5ED268BD87CD06F8F30B6881F49AF5BB8EAD
uid           [ultimate] you <you@email.com>
sub   rsa3072 2020-11-02 [E] [expires: 2022-11-02]

pub   rsa3072 2020-11-02 [SC] [expires: 2022-11-02]
      C351DB397FDFFD4499AB760435C0B93754D6ACD0
uid           [unknown] your-colleague <your-colleague@email.com>
sub   rsa3072 2020-11-02 [E] [expires: 2022-11-02]
```

You have added the key for 'your-colleague'. We now need to trust the key. Notice that your key has `[ultimate]` but the new one has `[unknown]`. Also note the ID for the new key. That's `C351DB397FDFFD4499AB760435C0B93754D6ACD0` in the example above. From now on we will refer to that key as `$GPG_ID`:

```
export GPG_ID='C351DB397FDFFD4499AB760435C0B93754D6ACD0'
```

Edit the key. This will activate and interactive session with gpg.

```
gpg --edit-key $GPG_ID
```

Type the trust command:

```
gpg> trust
```

```
pub  rsa3072/35C0B93754D6ACD0
     created: 2020-11-02  expires: 2022-11-02  usage: SC
     trust: unknown      validity: unknown
sub  rsa3072/84E6664F5F6A5734
     created: 2020-12-16  expires: 2022-12-16  usage: E
[unknown] (1). your-colleague <your-colleague@email.com>

Please decide how far you trust this user to correctly verify other users' keys
(by looking at passports, checking fingerprints from different sources, etc.)

  1 = I don't know or won't say
  2 = I do NOT trust
  3 = I trust marginally
  4 = I trust fully
  5 = I trust ultimately
  m = back to the main menu

Your decision? 5
```

Say yes until it is accepted and then exit gpg.

> Do you really **need** `ultimate`? You do not necessarily need it but it will get very annoying if you use a lower level of trust so I would say just go with ultimate.

Now you need to update the password store with the new key as in this example:

```
pass init `cat $PASSWORD_STORE_DIR/.gpg-id` $GPG_ID
```

That command is short hand for listing every public key ID in the init command. We store the ID for each public key, representing each team member, in the `.gpg-id` file in the repo. This command will add the new public key ID to the `.gpg-id` file and re-encrypt the store. This will allow your team member to decrypt the store with their key but they will not be able to encrypt.

Run `pass git push`

Your team member can now run `pass git pull` or just do a `git pull` in the password store directory.

Now your team member can run:

```
pass GitHub/backstage-example-token
```

They should see the decrypted secret.

### Read/Write

To allow your team member to encrypt the store they must have trusted all the public keys in the `.gpg-id` file. Their own public key must also have been trusted on the machine that encrypted the store last. We essentially need to setup a circle of trust with gpg keys.

I think it's reasonable to actually commit all public gpg keys to the pass store repository to make it easy for a new team member to go through and trust each one. It's possible to script this although I don't have a good script handy since gpg edit is interactive and I haven't used this in a team big enough where it was too annoying to trust each key one by one.

So to get write access, you follow the same steps that we did for [Readonly](#readonly) but with an additional step to trust all existing public keys on the machine that wants write permissions.

All those steps are true for every new member we add. Everyone must have all the public keys and have trusted them.

## Removing a Team Member <a name="removing-a-team-member"></a>

If you ever need to remove a team member, remove their public key from the `.gpg-id` file and re-encrypt the store.

```
pass init `cat $PASSWORD_STORE_DIR/.gpg-id`
```

## Conclusion <a name="conclusion"></a>

From this point on the secret store will work as a git repository and all the considerations will apply there around keeping in sync and handling conflicts. You may want to protect the main branch and use pull requests for modifying secrets for example.

Of course consider some good practices here. I would not use this to store highly sensitive data or production credentials. There's always a risk someone can get hold of this but that is always the case. At least keeping the data encrypted at rest gives you the best chance of avoiding accidental leaks during a normal development workflow.

This is one method I have seen evolve over years of dealing with secrets in teams. I hope this description helps. If you have more interesting ways of doing this I would love to hear about them! Also if you see something I got wrong here, I'd really appreciate if you let me know.

## Command Summary <a name="command-summary"></a>

### Setting up a new pass store

```
gpg --gen-key
```

Check the key:

```
gpg --list-keys
```

You need to copy the key ID. This gets just the key IDs:

```
gpg --list-keys --with-colons | grep fpr | cut -d: -f10
```

Setup pass:

```
export GPG_KEY='you-key-id'
pass init $GPG_KEY
pass insert some-secret
pass git init
pass git push -u --all
```

### Getting read access to an existing store

Generate a gpg key as above.

```
gpg --export --armor $GPG_KEY > pass-publickey.asc
```

Send `pass-publickey.asc` to someone who can decrypt the store.

**On their machine:**

```
gpg --import pass-publickey.asc
gpg --edit-key $GPG_ID

gpg> trust
```

Trust the key ultimately.

```
pass init `cat $PASSWORD_STORE_DIR/.gpg-id` $GPG_ID
pass git push
```

**Back on your machine:**

Either:

```
git clone git@github.com:you/your-pass.git ~/.password-store
```

or if you already setup the repo:

```
pass git pull
```

### Getting write access to an existing store

Same as read access but you also need to trust each public key in `.gpg-id`. Either each team member send you their exported key or you have them stored in one place. Maybe in the pass store repo itself?

**For each gpg key:**

```
gpg --import ${the-key-file}
gpg --edit-key $GPG_ID

gpg> trust
```

```

```
