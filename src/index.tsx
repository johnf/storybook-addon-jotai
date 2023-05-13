if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}

import { EVENTS, createInitialValues } from './constants';
import type { AnyWritableAtom, InitialValues } from './constants';

import React, { useEffect } from 'react';

import { Provider, useAtomValue } from "jotai";
import { useHydrateAtoms } from 'jotai/utils'

import addons, { makeDecorator } from '@storybook/addons';

type AtomHash = {
  [key: string]: AnyWritableAtom;
}

const Wrapper = ({ atoms, children } : { atoms: AtomHash, children: any } ) => {
  const channel = addons.getChannel();

  const useAtoms : AtomHash = {};
  Object.entries(atoms).forEach(([key, value] : [string, AnyWritableAtom]) => { useAtoms[key] = useAtomValue(value) as any; });
  const atomValues = Object.values(atoms);

  useEffect(() => {
    channel.emit(EVENTS.ATOMS_CHANGED, useAtoms);
  }, [atoms, useAtoms, atomValues]);

  return children;
};

const HydrateAtoms = ({ initialValues, children }: {
  initialValues: InitialValues,
  children: any,
}) => {
  useHydrateAtoms(initialValues);
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

    Object.entries(atoms).map(([key, atom] : [string, AnyWritableAtom]) => set(atom, values[key]));

    channel.emit(EVENTS.RENDERED, values);

    return (
      <Provider>
        <HydrateAtoms initialValues={get()}>
          <Wrapper atoms={atoms}>
            {storyFn(context)}
          </Wrapper>
        </HydrateAtoms>
      </Provider>
    );
  }
})
export default withJotai;
