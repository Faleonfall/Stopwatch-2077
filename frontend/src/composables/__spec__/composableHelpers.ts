import { render } from "@testing-library/vue";

// Runs a composable inside a mounted component, so its lifecycle hooks fire
// and the setup cleanup unmounts it after each test.
export function withSetup<T>(composable: () => T): T {
  let result: T | undefined;

  render({
    setup() {
      result = composable();
      return () => null;
    },
  });

  return result as T;
}
