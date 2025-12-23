"use client";

import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

export function ReportViewer() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        View and download various reports related to your shipments and operations.
      </p>
      <Empty>
        <EmptyHeader>
          <div className="text-4xl">📊</div>
          <EmptyTitle>No Reports Available</EmptyTitle>
          <EmptyDescription>Reports will appear here once you have shipment data</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
