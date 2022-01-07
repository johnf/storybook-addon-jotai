import { atom } from "jotai";
import type { Atom } from "jotai";

export const ADDON_ID = "storybook/jotai-addon";
export const PANEL_ID = `${ADDON_ID}/panel`;
export const PARAM_KEY = `jotai`;

export const EVENTS = {
  ATOMS_CHANGED: `${ADDON_ID}/atom_changed`,
  RENDERED: `${ADDON_ID}/rendered`,
};

export const createInitialValues = () => {
  const initialValues: (readonly [Atom<unknown>, unknown])[] = []
  const get = () => initialValues
  const set = <Value>(anAtom: Atom<Value>, value: Value) => {
    initialValues.push([anAtom, value])
  }
  return { get, set }
};

// FOr the tests as we need something shared
export const userAtom = atom(null);
