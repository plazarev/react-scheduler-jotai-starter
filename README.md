# DHTMLX React Scheduler - Jotai Demo

This demo shows how to use **DHTMLX React Scheduler** with **Jotai** as the single source of truth for Scheduler data and UI state.
It focuses on a practical bridge between Scheduler `data.save` operations and Jotai actions.

## Features
- Day/week/month views with a custom toolbar (Material UI)
- Create, update, and delete events via Jotai atoms
- Drag-and-drop rescheduling persisted to Jotai state
- Read-only toggle stored in Scheduler config
- Snapshot-based undo/redo for event and config changes (up to 50 history steps)

## Requirements
- Node.js: **^20.19.0 || >=22.12.0** (required by Vite 7)
- Package manager: **npm**

## Quick start

### 1) Install
```bash
npm install
```

### 2) Run
```bash
npm run dev
```

Open: http://localhost:5173

## Try it
- Create or drag an event and confirm the state is preserved after rerender.
- Use **Undo** and **Redo** in the toolbar.
- Toggle **Read-only** and verify editing is blocked.
- Navigate dates and switch views (navigation is not part of undo history).

## Project structure
- `src/components/Scheduler.tsx` - Scheduler initialization and `data.save` to Jotai bridge
- `src/components/Toolbar.tsx` - Custom toolbar (view buttons, navigation, undo/redo, read-only)
- `src/schedulerAtoms.ts` - Jotai state, actions, and snapshot history
- `src/seed/data.ts` - Seed events and default date/view
- `src/types.ts` - Shared Scheduler and snapshot types

## Scripts
- `dev` - run the app locally
- `build` - build for production
- `preview` - preview production build locally
- `lint` - run ESLint

## Notes
- Data is in-memory only. Refreshing the page resets to the seed dataset.
- Undo/redo in this demo tracks event/config mutations, not date/view navigation.

## License

Source code in this repo is released under the **MIT License**.

**DHTMLX React Scheduler** is a commercial library. Use it under a valid [DHTMLX license](https://dhtmlx.com/docs/products/licenses.shtml) or evaluation agreement.

## Useful links

[DHTMLX React Scheduler product page](https://dhtmlx.com/docs/products/dhtmlxScheduler-for-React/)

[DHTMLX Scheduler product page](https://dhtmlx.com/docs/products/dhtmlxScheduler/)

[Documentation](https://docs.dhtmlx.com/scheduler/)

[React Scheduler Documentation](https://docs.dhtmlx.com/gantt/integrations/react/)

[Blog](https://dhtmlx.com/blog/)

[Forum](https://forum.dhtmlx.com/)