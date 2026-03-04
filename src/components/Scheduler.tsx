import { useCallback, useMemo } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import ReactScheduler from "@dhtmlx/trial-react-scheduler";
import "@dhtmlx/trial-react-scheduler/dist/react-scheduler.css";

import Toolbar from "./Toolbar";
import {
  canRedoAtom,
  canUndoAtom,
  schedulerActionsAtom,
  schedulerStateViewAtom,
} from "../schedulerAtoms";
import type { SchedulerEvent, SchedulerEventId, SchedulerView } from "../types";

type SaveAction = "create" | "update" | "delete";
type SaveEntity = "event";

export default function DemoJotaiScheduler() {
  const state = useAtomValue(schedulerStateViewAtom);
  const dispatchAction = useSetAtom(schedulerActionsAtom);
  const canUndo = useAtomValue(canUndoAtom);
  const canRedo = useAtomValue(canRedoAtom);

  const { events, view, currentDate, config } = state;
  const activeDate = useMemo(() => new Date(currentDate), [currentDate]);
  const isReadOnly = Boolean((config as { readonly?: unknown }).readonly);

  const setCurrentDate = useCallback(
    (dateMs: number) => dispatchAction({ type: "setCurrentDate", payload: dateMs }),
    [dispatchAction]
  );
  const setView = useCallback(
    (nextView: SchedulerView) => dispatchAction({ type: "setView", payload: nextView }),
    [dispatchAction]
  );
  const undo = useCallback(() => dispatchAction({ type: "undo" }), [dispatchAction]);
  const redo = useCallback(() => dispatchAction({ type: "redo" }), [dispatchAction]);
  const updateReadOnly = useCallback(
    (value: boolean) => dispatchAction({ type: "updateConfig", payload: { readonly: value } }),
    [dispatchAction]
  );

  const handleDateNavigation = useCallback(
    (action: "prev" | "next" | "today") => {
      if (action === "today") {
        setCurrentDate(Date.now());
        return;
      }

      const step = action === "next" ? 1 : -1;
      const date = new Date(currentDate);

      if (view === "day") {
        date.setDate(date.getDate() + step);
      } else if (view === "week") {
        date.setDate(date.getDate() + step * 7);
      } else {
        date.setMonth(date.getMonth() + step);
      }

      setCurrentDate(date.getTime());
    },
    [currentDate, view, setCurrentDate]
  );

  const handleViewChange = useCallback(
    (mode: string, date: Date) => {
      const nextView: SchedulerView = mode === "day" || mode === "week" || mode === "month" ? mode : "month";
      setView(nextView);
      setCurrentDate(date.getTime());
    },
    [setView, setCurrentDate]
  );

  const dataBridge = useMemo(
    () => ({
      save: (entity: SaveEntity, action: SaveAction, payload: unknown, id: unknown) => {
        if (entity !== "event") {
          return;
        }

        switch (action) {
          case "update": {
            const eventData =
              payload && typeof payload === "object" ? (payload as Partial<SchedulerEvent>) : ({} as Partial<SchedulerEvent>);
            const eventId = eventData.id ?? id;
            if (eventId == null) {
              console.warn("Update called without an id", { payload, id });
              return;
            }

            const updatedEvent = { ...eventData, id: eventId } as Partial<SchedulerEvent> & Pick<SchedulerEvent, "id">;
            dispatchAction({ type: "updateEvent", payload: updatedEvent });
            return updatedEvent;
          }
          case "create": {
            const eventData =
              payload && typeof payload === "object"
                ? (payload as Omit<SchedulerEvent, "id"> & Partial<Pick<SchedulerEvent, "id">>)
                : null;
            if (!eventData) {
              console.warn("Create called without event payload", { payload });
              return;
            }
            return dispatchAction({ type: "createEvent", payload: eventData });
          }
          case "delete": {
            const deleteId =
              payload && typeof payload === "object"
                ? ((payload as { id?: unknown }).id ?? id)
                : payload ?? id;

            if (deleteId == null) {
              console.warn("Delete called without an id", { payload, id });
              return;
            }

            dispatchAction({ type: "deleteEvent", payload: deleteId as SchedulerEventId });
            return deleteId;
          }
          default:
            console.warn(`Unknown action: ${action}`);
            return;
        }
      },
    }),
    [dispatchAction]
  );

  const memoizedXY = useMemo(() => ({ nav_height: 0 }), []);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Toolbar
        currentView={view}
        currentDate={activeDate}
        isReadOnly={isReadOnly}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        onNavigate={handleDateNavigation}
        onReadOnlyChange={updateReadOnly}
        setView={setView}
      />

      <ReactScheduler
        events={events}
        view={view}
        date={activeDate}
        xy={memoizedXY}
        config={config}
        data={dataBridge}
        onViewChange={handleViewChange}
      />
    </div>
  );
}
