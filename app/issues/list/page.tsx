import Pagination from "@/app/components/Pagination";
import prisma from "@/prisma/client";
import { Issue, Status } from "@prisma/client";
import { Button, Flex } from "@radix-ui/themes";
import Link from "next/link";
import IssueStatusFilter from "./IssueStatusFilter";
import IssueTable, { columns } from "./IssueTable";

interface Props {
  searchParams: { status: Status; orderBy: keyof Issue; page: string };
}

async function IssuesPage({ searchParams }: Props) {
  const statuses = Object.values(Status);
  const status = statuses.includes(searchParams.status)
    ? searchParams.status
    : undefined;

  const orderBy =
    searchParams.orderBy &&
    columns.some((column) => column.value === searchParams.orderBy)
      ? { [searchParams.orderBy]: "asc" }
      : undefined;

  const page = parseInt(searchParams.page) || 1;
  const pageSize = 10;

  const issues = await prisma.issue.findMany({
    where: { status },
    orderBy,
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const issueCount = await prisma.issue.count({ where: { status } });

  return (
    <Flex direction="column" gap="3">
      <Flex justify="between">
        <IssueStatusFilter />
        <Button>
          <Link href="/issues/new">New Issue</Link>
        </Button>
      </Flex>

      <IssueTable searchParams={searchParams} issues={issues} />

      <Pagination
        pageSize={pageSize}
        currentPage={page}
        itemCount={issueCount}
      />
    </Flex>
  );
}

export const dynamic = "force-dynamic";
// export const revalidate = 60;

export default IssuesPage;
