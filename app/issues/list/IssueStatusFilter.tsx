"use client";
import { Select } from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const statuses = [
  { label: "All", value: "none" },
  { label: "Open", value: "OPEN" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Closed", value: "CLOSED" },
];

function IssueStatusFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  return (
    <Select.Root
      onValueChange={(status) => {
        const params = new URLSearchParams();
        if (status) params.append("status", status);
        if (searchParams.get("orderBy"))
          params.append("orderBy", searchParams.get("orderBy")!);
        router.push("/issues/list?" + params.toString());
      }}
    >
      <Select.Trigger placeholder="Filter by status..." />
      <Select.Content>
        {statuses.map((status) => (
          <Select.Item key={status.value} value={status.value || "none"}>
            {status.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
}

export default IssueStatusFilter;
