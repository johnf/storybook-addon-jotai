if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}

import { EVENTS, createInitialValues } from './constants';

import React, { useEffect } from 'react';

import { Provider } from "jotai";
import { useAtomValue } from "jotai/utils";
import type { Atom } from "jotai";

import addons, { makeDecorator } from '@storybook/addons';

type AtomHash = {
  [key: string]: Atom<unknown>;
}

interface WrapperProps {
  atoms: AtomHash,
}

const Wrapper: React.FC<WrapperProps> = ({ atoms, children }) => {
  const channel = addons.getChannel();

  const useAtoms : AtomHash = {};
  Object.entries(atoms).forEach(([key, value] : [string, Atom<unknown>]) => { useAtoms[key] = useAtomValue(value) as any; });
  const atomValues = Object.values(atoms);

  useEffect(() => {
    channel.emit(EVENTS.ATOMS_CHANGED, useAtoms);
  }, [atoms, useAtoms, atomValues]);

  return children;
};

export const withJotai = makeDecorator({
  name: 'withJotai',
  parameterName: 'jotai',
  skipIfNoParametersOrOptions: false, // Needs to be false so values get cleared
  wrapper: (storyFn, context, { parameters }) => {
    const channel = addons.getChannel();

    if (!parameters) {
      channel.emit(EVENTS.RENDERED, { note: 'withJotai decorator not used' });
      return storyFn(context);
    }

    const { get, set } = createInitialValues()

    const { atoms, values } = parameters;

    Object.entries(atoms).map(([key, atom] : [string, Atom<unknown>]) => set(atom, values[key]));

    channel.emit(EVENTS.RENDERED, values);

    return (
      <Provider initialValues={get()}>
        <Wrapper atoms={atoms}>
          {storyFn(context)}
        </Wrapper>
      </Provider>
    );
  }
})
export default withJotai;
