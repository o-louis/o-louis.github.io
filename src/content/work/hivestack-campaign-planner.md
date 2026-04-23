---
title: "Campaign planner for DOOH advertisers"
role: "Senior Frontend Developer"
company: "Hivestack (acquired by Perion DOOH)"
period: "2021 - 2026"
summary: "Built from scratch the campaign planning product DOOH advertisers use to schedule, target, and monitor billboard ad campaigns in real time."
stack: ["Vue 3", "TypeScript", "ECharts", "Mapbox"]
order: 1
---

## Context

Hivestack is a DOOH adtech platform, the plumbing that lets advertisers buy
programmatic inventory on billboards and digital signage. When I joined, there
was no dedicated UI for campaign planning: advertisers worked through a mix of
half-built screens and manual back-and-forth with the ops team.

## What I built

I was the only frontend on my squad, the rest of the SaaS was owned by other
teams, so the planner was mine end-to-end, from architecture to the last
pixel. One UI where advertisers compose a campaign, set targeting rules (geo,
daypart, audience), attach their creative, and watch it run live.

Three chunks carried the weight:

- The composer itself: forms, scheduling, targeting rules
- API wiring with the delivery and performance backends
- Live dashboards showing impressions, spend, and delivery pacing as the campaign ran

Performance got its own focus because ad delivery data is high-volume.
Visualizing it live without choking the browser meant a mix of virtualization,
server-side aggregation, and deliberate library choices: ECharts for the
heavy real-time dashboards, Mapbox for the geo targeting and inventory
visualization on maps.
