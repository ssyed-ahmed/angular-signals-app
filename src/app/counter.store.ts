import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

type CounterState = {
  count: number;
};

const initialState: CounterState = {
  count: 0,
};

export const CounterStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ count }) => ({
    doubleCount: computed(() => count() * 2),
  })),
  withMethods((store) => ({
    increment(): void {
      patchState(store, { count: store.count() + 1 });
    },
    decrement(): void {
      patchState(store, { count: store.count() - 1 });
    },
    reset(): void {
      patchState(store, initialState);
    },
  })),
);
