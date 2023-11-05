import { Button, Flex } from "@radix-ui/themes";
import prisma from "@/prisma/client";
import { Table } from "@radix-ui/themes";
import IssueStatusBadge from "../../components/IssueStatusBadge";
import Link from "next/link";
import NewtLink from "../../components/Link";
import IssueStatusFilter from "./IssueStatusFilter";
import { Status } from "@prisma/client";

async function IssuesPage({
  searchParams,
}: {
  searchParams: { status: Status | "none" };
}) {
  let issues;
  if (searchParams.status == "none") {
    issues = await prisma.issue.findMany();
  } else {
    issues = await prisma.issue.findMany({
      where: { status: searchParams.status },
    });
  }

  return (
    <div>
      <Flex className="mb-5" justify="between">
        <IssueStatusFilter />
        <Button>
          <Link href="/issues/new">New Issue</Link>
        </Button>
      </Flex>
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Issue</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="hidden md:table-cell">
              Status
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="hidden md:table-cell">
              Created
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {issues.map((issue) => (
            <Table.Row key={issue.id}>
              <Table.Cell>
                <NewtLink href={`/issues/${issue.id}`}>{issue.title}</NewtLink>
                <div className="block md:hidden">
                  <IssueStatusBadge status={issue.status} />
                </div>
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                <IssueStatusBadge status={issue.status} />
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                {issue.createdAt.toDateString()}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
}

export const dynamic = "force-dynamic";
// export const revalidate = 60;

export default IssuesPage;
