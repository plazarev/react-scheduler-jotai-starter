import { atom } from "jotai";
import { seedDate, seedEvents, seedView } from "./seed/data";
import type {
  SchedulerConfig,
  SchedulerEvent,
  SchedulerEventId,
  SchedulerSnapshot,
  SchedulerView,
} from "./types";

interface SchedulerState {
  events: SchedulerEvent[];
  currentDate: number;
  view: SchedulerView;
  config: SchedulerConfig;
}

export type SchedulerAction =
  | {
      type: "updateEvent";
      payload: Partial<SchedulerEvent> & Pick<SchedulerEvent, "id">;
    }
  | {
      type: "createEvent";
      payload: Omit<SchedulerEvent, "id"> & Partial<Pick<SchedulerEvent, "id">>;
    }
  | { type: "deleteEvent"; payload: SchedulerEventId }
  | { type: "setCurrentDate"; payload: number }
  | { type: "setView"; payload: SchedulerView }
  | { type: "updateConfig"; payload: Partial<SchedulerConfig> }
  | { type: "undo" }
  | { type: "redo" };

const schedulerStateAtom = atom<SchedulerState>({
  events: seedEvents as unknown as SchedulerEvent[],
  currentDate: seedDate,
  view: seedView,
  config: {},
});

const pastAtom = atom<SchedulerSnapshot[]>([]);
const futureAtom = atom<SchedulerSnapshot[]>([]);

const MAX_HISTORY_SIZE = 50;

const deepCopy = <T,>(value: T): T => {
  return JSON.parse(JSON.stringify(value)) as T;
};

const createSnapshot = (state: SchedulerState): SchedulerSnapshot => ({
  events: deepCopy(state.events),
  config: deepCopy(state.config),
});

export const schedulerActionsAtom = atom(
  null,
  (get, set, action: SchedulerAction): SchedulerEvent | void => {
    const currentState = get(schedulerStateAtom);
    const past = get(pastAtom);
    const future = get(futureAtom);

    const pushHistory = () => {
      set(pastAtom, [...past.slice(-MAX_HISTORY_SIZE + 1), createSnapshot(currentState)]);
      set(futureAtom, []);
    };

    if (action.type === "setCurrentDate") {
      set(schedulerStateAtom, { ...currentState, currentDate: action.payload });
      return;
    }

    if (action.type === "setView") {
      set(schedulerStateAtom, { ...currentState, view: action.payload });
      return;
    }

    if (action.type === "createEvent") {
      pushHistory();

      const id = action.payload.id != null ? action.payload.id : `id_${Date.now().toString()}`;
      const newEvent: SchedulerEvent = { ...action.payload, id } as SchedulerEvent;

      set(schedulerStateAtom, {
        ...currentState,
        events: [...currentState.events, newEvent],
      });
      return newEvent;
    }

    if (action.type === "updateEvent") {
      const index = currentState.events.findIndex((event) => String(event.id) === String(action.payload.id));
      if (index === -1) {
        return;
      }

      pushHistory();

      set(schedulerStateAtom, {
        ...currentState,
        events: [
          ...currentState.events.slice(0, index),
          { ...currentState.events[index], ...action.payload },
          ...currentState.events.slice(index + 1),
        ],
      });
      return;
    }

    if (action.type === "deleteEvent") {
      const exists = currentState.events.some((event) => String(event.id) === String(action.payload));
      if (!exists) {
        return;
      }

      pushHistory();

      set(schedulerStateAtom, {
        ...currentState,
        events: currentState.events.filter((event) => String(event.id) !== String(action.payload)),
      });
      return;
    }

    if (action.type === "updateConfig") {
      pushHistory();

      set(schedulerStateAtom, {
        ...currentState,
        config: { ...currentState.config, ...action.payload },
      });
      return;
    }

    if (action.type === "undo") {
      if (past.length === 0) {
        return;
      }

      const previous = past[past.length - 1];
      set(pastAtom, past.slice(0, -1));
      set(futureAtom, [createSnapshot(currentState), ...future]);
      set(schedulerStateAtom, {
        ...currentState,
        events: previous.events,
        config: previous.config,
      });
      return;
    }

    if (action.type === "redo") {
      if (future.length === 0) {
        return;
      }

      const next = future[0];
      set(futureAtom, future.slice(1));
      set(pastAtom, [...past, createSnapshot(currentState)]);
      set(schedulerStateAtom, {
        ...currentState,
        events: next.events,
        config: next.config,
      });
      return;
    }
  }
);

export const schedulerStateViewAtom = atom((get) => get(schedulerStateAtom));
export const canUndoAtom = atom((get) => get(pastAtom).length > 0);
export const canRedoAtom = atom((get) => get(futureAtom).length > 0);
