export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string };

export const idle = <T>(): AsyncState<T> => ({ status: 'idle' });
export const loading = <T>(): AsyncState<T> => ({ status: 'loading' });
export const success = <T>(data: T): AsyncState<T> => ({ status: 'success', data });
export const error = <T>(message: string): AsyncState<T> => ({ status: 'error', message });
