"use client";

import * as React from "react";
import { useInterval } from "./use-interval";
import { rand } from "../lib/utils";

export type ProgressState =
  | "initial"
  | "in-progress"
  | "completing"
  | "complete";

export function useProgress() {
  const [state, setState] = React.useState<ProgressState>("initial");
  const [value, setValue] = React.useState(0);

  useInterval(
    () => {
      setValue((current) => {
        if (current >= 99) return current;

        let diff;
        if (current === 0) {
          diff = 15;
        } else if (current < 50) {
          diff = rand(1, 10);
        } else {
          diff = rand(1, 5);
        }

        return Math.min(current + diff, 99);
      });
    },
    state === "in-progress" ? 750 : null
  );

  React.useEffect(() => {
    if (state === "initial") {
      setValue(0);
    } else if (state === "completing") {
      setValue(100);
      setState("complete");
    }
  }, [state]);

  function reset() {
    setState("initial");
  }

  function start() {
    setState("in-progress");
  }

  function done() {
    setState((state) =>
      state === "initial" || state === "in-progress" ? "completing" : state
    );
  }

  const style = React.useMemo(
    () => ({
      width: `${value}%`,
      transition: "width 200ms ease-out",
    }),
    [value]
  );

  return { state, value, style, start, done, reset };
}
