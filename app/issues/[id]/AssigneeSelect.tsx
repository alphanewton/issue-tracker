"use client";
import { Select } from "@radix-ui/themes";
import React from "react";

function AssigneeSelect() {
  return (
    <Select.Root>
      <Select.Trigger placeholder="Assign..." />
      <Select.Content>
        <Select.Group>
          <Select.Label>Suggestions</Select.Label>
          <Select.Item value="1">Newton Narzary</Select.Item>
          <Select.Item value="2">Gitanjali Narzary</Select.Item>
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
}

export default AssigneeSelect;
