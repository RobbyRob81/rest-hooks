import NetworkManager from './NetworkManager.js';
import type Controller from '../controller/Controller.js';
import type { Reducer, Dispatch, ReducerState } from '../middlewareTypes.js';
import { Manager } from '../types.js';

export default function applyManager(
  managers: Manager[],
  controller: Controller,
): Middleware[] {
  /* istanbul ignore next */
  if (
    process.env.NODE_ENV !== 'production' &&
    !managers.find(mgr => mgr instanceof NetworkManager)
  ) {
    console.warn('NetworkManager not found; this is a required manager.');
    console.warn(
      'See https://dataclient.io/docs/guides/redux for hooking up redux',
    );
  }
  return managers.map((manager, i) => {
    const middleware = manager.getMiddleware();
    return ({ dispatch, getState }) => {
      if (i === 0) {
        (controller as any).dispatch = dispatch;
        (controller as any).getState = getState;
      }
      // controller is a superset of the middleware API
      return middleware(controller as Controller<any>);
    };
  });
}

/* These should be compatible with redux */
export interface MiddlewareAPI<
  R extends Reducer<any, any> = Reducer<any, any>,
> {
  getState: () => ReducerState<R>;
  dispatch: Dispatch<R>;
}
export type Middleware = <R extends Reducer<any, any>>({
  dispatch,
}: MiddlewareAPI<R>) => (next: Dispatch<R>) => Dispatch<R>;
