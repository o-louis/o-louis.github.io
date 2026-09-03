---
title: "Set methods, iterators, Temporal"
description: "Three recent JavaScript additions, sorted by whether they run in browsers today rather than by how far along the spec is."
pubDate: 2026-06-15
tags: ["javascript"]
draft: false
---

Stage 4 means a feature's specification is finished. Whether it runs in your
users' browsers is a separate milestone, and the gap between the two can be
years.

Here are three recent additions to JavaScript, sorted by that second
question.

## Safe today: set methods

Available across current browsers since June 2024.

Comparing two sets used to mean converting to arrays and filtering by hand.
Now it does not:

```js
const a = new Set([1, 2, 3])
const b = new Set([2, 3, 4])

a.union(b)         // Set { 1, 2, 3, 4 }
a.intersection(b)  // Set { 2, 3 }
a.difference(b)    // Set { 1 }
```

[`union`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/union), [`intersection`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/intersection) and
[`difference`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/difference) have four siblings:
[`symmetricDifference`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/symmetricDifference),
[`isSubsetOf`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/isSubsetOf), [`isSupersetOf`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/isSupersetOf)
and [`isDisjointFrom`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/isDisjointFrom). All of them return new sets
and leave the originals alone.

Small feature, but it deletes a helper file from most codebases.

## Safe today: iterator helpers

Available across current browsers since March 2025.

This one is more interesting, because it changes *when* work happens rather
than how much code you write.

Array methods are eager. Each one walks the whole collection and builds a new
array before the next one starts. [Iterator helpers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Iterator) are lazy:
nothing is
computed until something asks for the next value.

<figure class="not-prose my-10">
<svg viewBox="0 0 340 250" role="img" aria-labelledby="lazy-diagram-title lazy-diagram-desc" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;max-width:420px;height:auto;margin:0 auto">
<title id="lazy-diagram-title">Eager array methods versus lazy iterator helpers</title>
<desc id="lazy-diagram-desc">Array methods process all one million items at filter, then all matches at map, then discard everything after the first ten. Iterator helpers pull one item at a time through filter and map and stop once ten items have been produced.</desc>
<defs>
<marker id="tip-subtle-2" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
<path d="M0,1 L7,4 L0,7" fill="none" stroke="var(--color-subtle)" stroke-width="1.2" />
</marker>
<marker id="tip-accent-2" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
<path d="M0,1 L7,4 L0,7" fill="none" stroke="var(--color-accent)" stroke-width="1.2" />
</marker>
</defs>
<g font-family="ui-monospace, SF Mono, Menlo, Consolas, monospace" font-size="9.5" letter-spacing="1.2" fill="var(--color-subtle)">
<text x="0" y="12">ARRAY METHODS</text>
<text x="190" y="12">ITERATOR HELPERS</text>
</g>
<g fill="none" stroke="var(--color-line)" stroke-width="1">
<rect x="0" y="30" width="150" height="38" rx="3" />
<rect x="0" y="94" width="150" height="38" rx="3" />
<rect x="0" y="158" width="150" height="38" rx="3" />
<rect x="190" y="30" width="150" height="38" rx="3" />
<rect x="190" y="94" width="150" height="38" rx="3" />
<rect x="190" y="158" width="150" height="38" rx="3" />
</g>
<g font-family="Inter, system-ui, sans-serif" font-size="12" text-anchor="middle" fill="var(--color-fg)">
<text x="75" y="54">filter</text>
<text x="75" y="118">map</text>
<text x="75" y="182">take 10</text>
<text x="265" y="54">filter</text>
<text x="265" y="118">map</text>
<text x="265" y="182">take 10</text>
</g>
<g font-family="Inter, system-ui, sans-serif" font-size="10" text-anchor="start" fill="var(--color-muted)">
<text x="85" y="85">1M items</text>
<text x="85" y="149">every match</text>
<text x="275" y="85">1 item</text>
<text x="275" y="149">1 item</text>
</g>
<g fill="none" stroke="var(--color-subtle)" stroke-width="1" marker-end="url(#tip-subtle-2)">
<line x1="75" y1="68" x2="75" y2="90" />
<line x1="75" y1="132" x2="75" y2="154" />
</g>
<g fill="none" stroke="var(--color-accent)" stroke-width="1" marker-end="url(#tip-accent-2)">
<line x1="265" y1="68" x2="265" y2="90" />
<line x1="265" y1="132" x2="265" y2="154" />
</g>
<g font-family="Inter, system-ui, sans-serif" font-size="10.5" text-anchor="middle" fill="var(--color-muted)">
<text x="75" y="222">two arrays built,</text>
<text x="75" y="236">then thrown away</text>
<text x="265" y="222">stops after</text>
<text x="265" y="236">ten items</text>
</g>
</svg>
<figcaption class="mt-5 text-sm text-subtle">Same result. The left column does the work anyway.</figcaption>
</figure>

Say you want the first ten errors out of a million log lines:

```js
// Eager: filters all million, maps every match,
// then throws away everything after the tenth.
const firstTen = lines
  .filter((l) => l.startsWith('ERROR'))
  .map(parse)
  .slice(0, 10)

// Lazy: stops as soon as it has ten.
const firstTen = lines
  .values()
  .filter((l) => l.startsWith('ERROR'))
  .map(parse)
  .take(10)
  .toArray()
```

The second version reads almost identically and does a fraction of the work.
[`.values()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/values) turns the array into an iterator, and
[`.toArray()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Iterator/toArray) collects the
result at the end — the chain in between never builds an intermediate array.

This also works on things that were awkward before: generators,
[`Map.keys()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/keys), anything iterable. And on an infinite
generator, [`take`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Iterator/take) is what makes the chain terminate at
all.

## Not yet: Temporal

[`Temporal`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal) is the replacement for [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date), and
`Date` has needed replacing for
about twenty years. Months counted from zero, silent mutation, no real time
zone support.

Temporal fixes all of it. Objects are immutable, so operations return new
values instead of modifying in place:

```js
const start = Temporal.PlainDate.from('2021-01-01')
const end = start.add({ years: 1, months: 2, weeks: 3, days: 4 })

end.toString()   // '2022-03-26'
start.toString() // '2021-01-01', untouched
```

Here is the catch. MDN currently lists Temporal as **limited availability** —
it does not work in some of the most widely used browsers. It is Stage 4 and
the specification is final, but shipping it today means shipping a polyfill,
and the polyfill is not small.

Worth learning now. Not worth putting in a bundle yet.
