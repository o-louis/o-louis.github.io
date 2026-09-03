---
title: "Vue's Vapor Mode removes two steps"
description: "Vue 3.6 can compile components straight to DOM operations. What the two removed steps were, how to switch it on, and what you give up."
pubDate: 2026-07-20
tags: ["vue", "performance"]
draft: false
---

Vue 3.6 is in release candidate right now, and its headline feature is Vapor
Mode. You have probably seen the phrase "no virtual DOM" go past a few times
without anyone stopping to explain what that actually removes.

Here is the whole idea in one picture.

<figure class="not-prose my-10">
<svg viewBox="0 0 340 310" role="img" aria-labelledby="vapor-diagram-title vapor-diagram-desc" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;max-width:420px;height:auto;margin:0 auto">
<title id="vapor-diagram-title">How Vapor Mode shortens the update path</title>
<desc id="vapor-diagram-desc">Side by side. With the virtual DOM, a data change goes through four steps: data changes, describe the page, compare to the previous description, update the DOM. With Vapor Mode, a data change goes straight from data changes to updating the DOM, skipping the two middle steps.</desc>
<defs>
<marker id="tip-subtle" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
<path d="M0,1 L7,4 L0,7" fill="none" stroke="var(--color-subtle)" stroke-width="1.2" />
</marker>
<marker id="tip-accent" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
<path d="M0,1 L7,4 L0,7" fill="none" stroke="var(--color-accent)" stroke-width="1.2" />
</marker>
</defs>
<g font-family="ui-monospace, SF Mono, Menlo, Consolas, monospace" font-size="9.5" letter-spacing="1.2" fill="var(--color-subtle)">
<text x="0" y="12">VIRTUAL DOM</text>
<text x="190" y="12">VAPOR MODE</text>
</g>
<g fill="none" stroke="var(--color-line)" stroke-width="1">
<rect x="0" y="30" width="150" height="40" rx="3" />
<rect x="0" y="96" width="150" height="40" rx="3" />
<rect x="0" y="162" width="150" height="40" rx="3" />
<rect x="0" y="228" width="150" height="40" rx="3" />
<rect x="190" y="30" width="150" height="40" rx="3" />
<rect x="190" y="228" width="150" height="40" rx="3" />
</g>
<g font-family="Inter, system-ui, sans-serif" font-size="12" text-anchor="middle" fill="var(--color-fg)">
<text x="75" y="55">Data changes</text>
<text x="75" y="121">Describe the page</text>
<text x="75" y="187">Compare</text>
<text x="75" y="253">Update the DOM</text>
<text x="265" y="55">Data changes</text>
<text x="265" y="253">Update the DOM</text>
</g>
<g fill="none" stroke="var(--color-subtle)" stroke-width="1" marker-end="url(#tip-subtle)">
<line x1="75" y1="70" x2="75" y2="92" />
<line x1="75" y1="136" x2="75" y2="158" />
<line x1="75" y1="202" x2="75" y2="224" />
</g>
<line x1="265" y1="70" x2="265" y2="224" stroke="var(--color-accent)" stroke-width="1" marker-end="url(#tip-accent)" />
<g font-family="Inter, system-ui, sans-serif" font-size="10.5" text-anchor="middle" fill="var(--color-muted)">
<text x="75" y="292">on every update</text>
<text x="265" y="292">straight through</text>
</g>
</svg>
<figcaption class="mt-5 text-sm text-subtle">Vapor Mode does not make the middle steps faster. It removes them.</figcaption>
</figure>

## What the two middle steps are

When your data changes, Vue does not touch the page straight away. It first
builds a description of what the page *should* look like, in memory. Then it
compares that description to the previous one and applies only what differs.

That description is the virtual DOM, and the comparison is what people call
"diffing". It is a good trade: you write what the UI should look like, and Vue
works out the smallest set of changes. The cost is that this happens on every
update, at runtime, forever.

## Why Vapor can skip them

The compiler already knows a lot at build time. Reading your template, it can
see which parts are fixed and which parts can actually change.

Vapor Mode uses that. Instead of generating code that builds a description to
compare later, it generates code that goes straight to the nodes that can
change. Less work at runtime, and less framework code shipped to the browser.

## Turning it on

It is per-component, not a global switch:

```vue
<script setup vapor>
// ...
</script>
```

For a template-only component, mark the template instead:

```vue
<template vapor>
  <p>Hello</p>
</template>
```

And if you are starting fresh and want the whole app in Vapor Mode:

```js
import { createVaporApp } from 'vue'

createVaporApp(App).mount('#app')
```

## What you give up

This is the part most articles skip, and it is the part that decides whether
you can actually use it.

A Vapor component cannot use the Options API — `<script setup>` or a
template-only component, nothing else. `getCurrentInstance()` returns `null`.
`app.config.globalProperties` is gone, so is `v-memo`, and so are the
`@vue:xxx` per-element lifecycle events. Template refs on components no longer
expose `$el`, `$props`, `$attrs`, `$slots` or `$refs`.

None of these are bugs waiting to be fixed. They are the price of dropping the
runtime layer that used to provide them.

## Mixing Vapor and normal components

You do not have to pick one for the whole app:

```js
import { createApp, vaporInteropPlugin } from 'vue'

createApp(App).use(vaporInteropPlugin).mount('#app')
```

Worth knowing: the Vue team warns there may still be rough edges when using a
virtual-DOM-based component library inside Vapor Mode. If your UI leans on a
third-party library, test that first rather than last.

## So should you care yet

Not urgently. Vue 3.6 has not shipped stable — 3.5 is still current — and
because Vapor Mode is opt-in per component, there is no migration to plan and
nothing you have written stops working.

What it changes is the ceiling. When a component is genuinely hot — a long
list, a live-updating dashboard, a view running on hardware slower than your
laptop — you now have a way to cut the runtime cost without leaving Vue.

Good thing to have. Bad thing to reach for by default.
