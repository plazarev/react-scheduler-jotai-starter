# DHTMLX React Scheduler with Jotai State Management

A working demo of **DHTMLX React Scheduler** integrated with **Jotai** as the single source of truth for event data and UI state. Demonstrates event CRUD, view/date synchronization, read-only mode, and snapshot-based undo/redo — all wired through Jotai atoms.

**Related tutorial**: [React Scheduler + Jotai integration guide](https://docs.dhtmlx.com/scheduler/integrations/react/state/jotai/)

## What is DHTMLX React Scheduler with Jotai Starter
 
This starter shows how to connect DHTMLX React Scheduler to Jotai, a lightweight atomic state management library for React. Instead of keeping scheduler data in local component state or an ad-hoc store, all events and configuration live in Jotai atoms. The key pattern is a bridge between Scheduler's `data.save` callback and Jotai actions, so every user interaction (create, update, delete, drag-and-drop) flows through a single predictable state layer.
 
The demo also implements snapshot-based undo/redo, storing up to 50 history steps for event and config mutations. A custom Material UI toolbar handles view switching, date navigation, undo/redo controls, and a read-only toggle — all driven by Jotai state.
 
The project is built with React, TypeScript, and Vite.

## When to use
 
- Use this demo when you need to manage DHTMLX Scheduler data with a global atomic state store instead of lifting state manually through component props
- Use this as a starting point for apps where scheduler state needs to be shared across multiple components or synced with other UI elements.
- Use this when building a React + TypeScript scheduler with a custom toolbar and Material UI controls.

## Quick Start
 
```bash
git clone https://github.com/DHTMLX/react-scheduler-jotai-starter
cd react-scheduler-jotai-starter
npm install
npm run dev
```
 
Open [http://localhost:5173](http://localhost:5173) in your browser.
 
**Requirements:** Node.js `^20.19.0 || >=22.12.0` (required by Vite 7), npm.
 
## Try it
 
Once running, try these interactions to see the Jotai integration in action:
 
1. Create or drag an event — confirm state is preserved after rerender.
2. Click **Undo** and **Redo** in the toolbar to step through event history.
3. Toggle **Read-only** to verify that editing is blocked at the Scheduler config level.
4. Switch views and navigate dates — note that navigation is intentionally excluded from undo history.

## Architecture
 
```
src/
├── components/
│   ├── Scheduler.tsx     # Scheduler initialization + data.save → Jotai bridge
│   └── Toolbar.tsx       # Custom toolbar: views, navigation, undo/redo, read-only
├── schedulerAtoms.ts     # All Jotai atoms, actions, and snapshot history logic
├── seed/data.ts          # Initial event dataset and default date/view config
└── types.ts              # Shared TypeScript types for Scheduler events and snapshots
```
 
Data flows in one direction: Scheduler fires `data.save` → the bridge dispatches a Jotai action → atoms update → React re-renders. Undo/redo stores atom snapshots and replays them on demand.
 
## Key Patterns
 
- **`data.save` to Jotai bridge** — Scheduler mutations are intercepted in `Scheduler.tsx` and dispatched as Jotai write actions, keeping the atom store as the single source of truth.
- **Snapshot-based undo/redo** — `schedulerAtoms.ts` stores a stack of atom snapshots (up to 50 steps) and exposes undo/redo actions that restore previous states.
- **Config-level read-only toggle** — read-only mode is stored in a Jotai atom and passed to Scheduler's config, so it affects drag-and-drop and form interactions natively.
- **Atomic view/date state** — current view and active date are atoms, making it trivial to sync them with external controls like the custom toolbar.

## Features
 
| Feature | Details |
|---|---|
| Event CRUD | Create, update, and delete events via Jotai atoms |
| Drag-and-drop | Rescheduling persisted to Jotai state |
| Views | Day, week, and month views |
| Custom toolbar | Material UI toolbar with view buttons and date navigation |
| Undo/redo | Snapshot-based, up to 50 history steps for events and config |
| Read-only mode | Toggle stored in Scheduler config atom, blocks all editing |
| TypeScript | Full type coverage for events, atoms, and snapshots |
| Vite | Fast dev server and production build |
 
## Production Notes
 
This demo is a starter, not a production-ready application. For production use, consider:
 
- **Persistence** — data is in-memory only; refreshing the page resets to the seed dataset. Add a backend or `localStorage` sync to persist events.
- **Authentication** — no auth or multi-user support is included.
- **Undo history scope** — the 50-step limit and exclusion of navigation from history are design choices you may want to adjust.
- **Scheduler license** — DHTMLX React Scheduler requires a valid commercial license for production use (see License section below).

## Related Resources
 
- [DHTMLX React Scheduler product page](https://dhtmlx.com/docs/products/dhtmlxScheduler-for-React/)
- [DHTMLX Scheduler product page](https://dhtmlx.com/docs/products/dhtmlxScheduler/)
- [DHTMLX Scheduler documentation](https://docs.dhtmlx.com/scheduler/)
- [DHTMLX Scheduler React integration guide](https://docs.dhtmlx.com/scheduler/howtostart_react.html)
- [Community forum](https://forum.dhtmlx.com/)
- [Report an issue](https://github.com/DHTMLX/react-scheduler-jotai-starter/issues)

## License
 
The source code in this repository is released under the **MIT License**.
 
**Commercial License**
Required for proprietary or commercial applications. Includes access to PRO features, dedicated technical support, and long-term maintenance.
[Learn more →](https://dhtmlx.com/docs/products/dhtmlxScheduler-for-React/#licensing)

**Try before you buy**
A free evaluation of DHTMLX React Gantt is available — no credit card required.
[Start your evaluation →](https://dhtmlx.com/docs/products/dhtmlxScheduler-for-React/download.shtml)
