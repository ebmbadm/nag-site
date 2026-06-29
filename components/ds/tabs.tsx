"use client";

import * as React from "react";
import { PillGroup } from "./pill-group";

export type TabItem = {
  value: string;
  label: string;
  content: React.ReactNode;
};

export type TabsProps = {
  items: TabItem[];
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
};

/** Tabbed panel — uncontrolled (defaultValue) or controlled (value + onChange). */
export function Tabs({ items, defaultValue, value, onChange }: TabsProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState(
    defaultValue ?? items[0]?.value ?? "",
  );
  const active = isControlled ? value : internalValue;

  function handleChange(v: string) {
    if (!isControlled) setInternalValue(v);
    onChange?.(v);
  }

  const tabOptions = items.map((item) => ({
    value: item.value,
    label: item.label,
  }));

  return (
    <div>
      <PillGroup
        options={tabOptions}
        value={active}
        onChange={handleChange}
        tabRole
        className="mb-6"
      />
      {items.map((item) => {
        const panelId = `tabpanel-${item.value}`;
        const tabId = `tab-${item.value}`;
        const isActive = item.value === active;
        return (
          <div
            key={item.value}
            id={panelId}
            role="tabpanel"
            aria-labelledby={tabId}
            aria-label={item.label}
            hidden={!isActive || undefined}
          >
            {item.content}
          </div>
        );
      })}
    </div>
  );
}
