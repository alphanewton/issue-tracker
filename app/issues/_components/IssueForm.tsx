"use client";

import { issueSchema } from "@/app/ValidationSchemas";
import ErrorMessage from "@/app/components/ErrorMessage";
import Spinner from "@/app/components/Spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Issue } from "@prisma/client";
import { Button, Select, TextField } from "@radix-ui/themes";
import axios from "axios";
import "easymde/dist/easymde.min.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import SimpleMDE from "react-simplemde-editor";
import { z } from "zod";

type IssueFormData = z.infer<typeof issueSchema>;

function IssueForm({ issue }: { issue?: Issue }) {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IssueFormData>({
    resolver: zodResolver(issueSchema),
  });

  const [isSubmitting, setSubmitting] = useState(false);

  return (
    <div className="max-w-xl">
      <form
        className="space-y-3"
        onSubmit={handleSubmit(async (data) => {
          try {
            console.log(data);
            setSubmitting(true);
            if (issue) await axios.patch("/api/issues/" + issue.id, data);
            else await axios.post("/api/issues", data);
            router.push("/issues/list");
            router.refresh();
          } catch (error) {
            setSubmitting(false);
          }
        })}
      >
        <TextField.Root>
          <TextField.Input
            defaultValue={issue?.title}
            placeholder="title"
            {...register("title")}
          />
        </TextField.Root>
        <ErrorMessage>{errors.title?.message}</ErrorMessage>

        <Select.Root defaultValue={issue?.status} {...register("status")}>
          <Select.Group>
            <Select.Trigger placeholder="Status" />
            <Select.Content>
              <Select.Item key="OPEN" value="OPEN">
                Open
              </Select.Item>
              <Select.Item key="IN_PROGRESS" value="IN_PROGRESS">
                In Progress
              </Select.Item>
              <Select.Item key="CLOSED" value="CLOSED">
                Closed
              </Select.Item>
            </Select.Content>
          </Select.Group>
        </Select.Root>
        <ErrorMessage>{errors.status?.message}</ErrorMessage>

        <Controller
          name="description"
          control={control}
          defaultValue={issue?.description}
          render={({ field }) => (
            <SimpleMDE placeholder="Description" {...field} />
          )}
        />
        <ErrorMessage>{errors.description?.message}</ErrorMessage>

        <Button disabled={isSubmitting}>
          {issue ? "Update Issue" : "Submit New Issue"}{" "}
          {isSubmitting && <Spinner />}
        </Button>
      </form>
    </div>
  );
}

export default IssueForm;
