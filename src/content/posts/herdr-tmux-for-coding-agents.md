---
title: "herdr, or tmux for coding agents"
description: "A terminal multiplexer built around coding agents rather than shells: persistent sessions, a status per pane, and an API the agents drive themselves."
pubDate: 2026-08-16
tags: ["tooling", "terminal"]
draft: false
---

I came across [herdr](https://herdr.dev/) this week. It is a terminal
multiplexer, except it is built around coding agents instead of shells, and
that turns out to change quite a lot.

## The problem it names

Running one coding agent is easy: you watch it. Running six is not. They work
for minutes or hours, on different branches, across a laptop and a couple of
remote boxes, and you end up cycling through panes asking the same question —
which of these is waiting on me?

The pitch is that keeping track of the work has become the bottleneck, not the
work itself. That matches what the tooling around agents looks like today:
plenty of ways to start them, not much for watching several at once.

## What it does

<figure class="not-prose my-10">
<svg viewBox="0 0 340 250" role="img" aria-labelledby="herdr-diagram-title herdr-diagram-desc" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;max-width:420px;height:auto;margin:0 auto">
<title id="herdr-diagram-title">Who owns the agent's terminal</title>
<desc id="herdr-diagram-desc">Without a server, your terminal owns the agent directly, so closing the window kills the run. With herdr, your terminal attaches to a background server, and the server owns the agent, so the run survives a disconnect.</desc>
<defs>
<marker id="tip-subtle-3" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
<path d="M0,1 L7,4 L0,7" fill="none" stroke="var(--color-subtle)" stroke-width="1.2" />
</marker>
<marker id="tip-accent-3" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
<path d="M0,1 L7,4 L0,7" fill="none" stroke="var(--color-accent)" stroke-width="1.2" />
</marker>
</defs>
<g font-family="ui-monospace, SF Mono, Menlo, Consolas, monospace" font-size="9.5" letter-spacing="1.2" fill="var(--color-subtle)">
<text x="0" y="12">ON ITS OWN</text>
<text x="190" y="12">UNDER HERDR</text>
</g>
<g fill="none" stroke="var(--color-line)" stroke-width="1">
<rect x="0" y="30" width="150" height="38" rx="3" />
<rect x="0" y="94" width="150" height="38" rx="3" />
<rect x="190" y="30" width="150" height="38" rx="3" />
<rect x="190" y="94" width="150" height="38" rx="3" />
<rect x="190" y="158" width="150" height="38" rx="3" />
</g>
<g font-family="Inter, system-ui, sans-serif" font-size="12" text-anchor="middle" fill="var(--color-fg)">
<text x="75" y="54">Your terminal</text>
<text x="75" y="118">agent</text>
<text x="265" y="54">Your terminal</text>
<text x="265" y="118">herdr server</text>
<text x="265" y="182">agent</text>
</g>
<line x1="75" y1="68" x2="75" y2="90" stroke="var(--color-subtle)" stroke-width="1" marker-end="url(#tip-subtle-3)" />
<line x1="265" y1="68" x2="265" y2="90" stroke="var(--color-subtle)" stroke-width="1" stroke-dasharray="3 3" marker-end="url(#tip-subtle-3)" />
<line x1="265" y1="132" x2="265" y2="154" stroke="var(--color-accent)" stroke-width="1" marker-end="url(#tip-accent-3)" />
<g font-family="Inter, system-ui, sans-serif" font-size="10" text-anchor="start" fill="var(--color-muted)">
<text x="85" y="85">owns it</text>
<text x="275" y="85">attaches</text>
<text x="275" y="149">owns it</text>
</g>
<g font-family="Inter, system-ui, sans-serif" font-size="10.5" text-anchor="middle" fill="var(--color-muted)">
<text x="75" y="160">close the window,</text>
<text x="75" y="174">the run is gone</text>
<text x="265" y="224">close the window,</text>
<text x="265" y="238">the run continues</text>
</g>
</svg>
<figcaption class="mt-5 text-sm text-subtle">The dashed line is the whole point: the client can come and go.</figcaption>
</figure>

A background server owns the terminal sessions. That is the important part:
the agents are not children of your terminal window, so closing the lid,
dropping an SSH connection or restarting the machine does not kill the run.
You reattach and the layout comes back.

Work is organised as workspaces, tabs and panes — familiar if you have used
tmux — and each pane carries a status: `working`, `blocked` or `idle`. That
status is the actual feature. Instead of hunting for the agent that stopped
to ask a question, you get something closer to a queue of things needing your
attention.

It does not replace the agents themselves. It holds their terminals and
leaves their own CLIs alone, which is why it can support a lot of them
natively rather than integrating with each one.

## The part I find interesting

tmux can be automated, but you automate it by sending keystrokes at a session
and hoping the state on the other end is what you expected. herdr exposes a
CLI and a socket API, and it is the same surface the agents themselves use.
Agents can split panes, start other agents, and prompt each other through it.

That is a real design decision rather than a feature list. The multiplexer
stops being something a human drives and becomes something the programs
inside it can drive too.

I have not used it long enough to say how it holds up on a real week of work.
But the framing is right: once you are running more than two agents, the hard
part stops being the agents and starts being knowing where they all are.
