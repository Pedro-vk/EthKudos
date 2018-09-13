import { Action, INIT } from '@ngrx/store';

export function reduceActions<T>(reducer: (T, Action) => T, actions?: Action[], returnSteps?: false): T;
export function reduceActions<T>(reducer: (T, Action) => T, actions: Action[], returnSteps: true): T[];
export function reduceActions<T>(reducer: (T, Action) => T, actions: Action[] = [], returnSteps: boolean = false): T | T[] {
  const steps = [];
  const finalState = [
      {type: INIT},
      ...actions,
    ]
    .reduce((state, action) => {
      const nextState = reducer(state, action);
      steps.push({...(<any>nextState), $action: action});
      return nextState;
    }, <any>undefined);
  return returnSteps ? steps : finalState;
}
