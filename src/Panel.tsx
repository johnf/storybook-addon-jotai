import React, { useState } from "react";
import { useChannel } from "@storybook/api";

import { AddonPanel } from "@storybook/components";
import { EVENTS } from "./constants";
import { PanelContent } from "./components/PanelContent";

interface PanelProps {
  active: boolean;
  key: string;
}

export const Panel: React.FC<PanelProps> = (props) => {
  const [currentValues, setCurrentValues] = useState({});
  const [initialValues, setInitialValues] = useState({});

  const { RENDERED, ATOMS_CHANGED } = EVENTS;
  useChannel({
    [RENDERED]: (values) => {
      setInitialValues(values);
      setCurrentValues(values);
    },
    [ATOMS_CHANGED]: (values) => {
      setCurrentValues(values);
    },
  });

  return (
    <AddonPanel {...props}>
      <PanelContent currentValues={currentValues} initialValues={initialValues} />
    </AddonPanel>
  );
};
