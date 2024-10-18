import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { UserFormDialog } from "../entities/users/UserFormDialog";
import type React from "react";

const TableWrapper = ({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title: string;
  description?: string;
}) => {
  return (
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle>{title}</CardTitle>
          <UserFormDialog />
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-10</strong> of <strong>32</strong> products
        </div>
      </CardFooter>
    </Card>
  );
};

export default TableWrapper;
