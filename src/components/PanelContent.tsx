import React from "react";
import { themes, convert } from "@storybook/theming";
import { TabsState } from "@storybook/components";

interface PanelContentProps {
  initialValues: any,
  currentValues: any,
}

export const PanelContent: React.FC<PanelContentProps> = ({ initialValues, currentValues }) => (
  <TabsState
    initial="initialValues"
    backgroundColor={convert(themes.normal).background.hoverable}
  >
    <div
      id="initialValues"
      title="Initial Values"
      color={convert(themes.normal).color.purple}
    >
      <pre>
        {JSON.stringify(initialValues, null, 2)}
      </pre>
    </div>
    <div
      id="currentValues"
      title="Current Values"
      color={convert(themes.normal).color.green}
    >
      <pre>
        {JSON.stringify(currentValues, null, 2)}
      </pre>
    </div>
  </TabsState>
);
