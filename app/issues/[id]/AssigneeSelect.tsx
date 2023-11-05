"use client";
import { Issue, User } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

function AssigneeSelect({ issue }: { issue: Issue }) {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await axios.get<User[]>("/api/users");
      setUsers(data);
    };
    fetchUsers();
  }, []);

  return (
    <>
      <Select.Root
        defaultValue={issue.assignedToUserId || "none"}
        onValueChange={async (userId) => {
          axios
            .patch("/api/issues/" + issue.id, {
              assignedToUserId: userId === "none" ? null : userId,
            })
            .catch(() => toast.error("Changes could not be saved"));
        }}
      >
        <Select.Trigger placeholder="Assign..." />
        <Select.Content>
          <Select.Group>
            <Select.Label>Suggestions</Select.Label>
            <Select.Item value="none">Unassigned</Select.Item>
            {users.map((user) => (
              <Select.Item key={user.id} value={user.id}>
                {user.name}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
      <Toaster></Toaster>
    </>
  );
}

export default AssigneeSelect;
