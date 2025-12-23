"use client";

import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

export function DispatchManager() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Manage dispatch operations and track Mzigo movement.
      </p>
      <Empty>
        <EmptyHeader>
          <div className="text-4xl">📍</div>
          <EmptyTitle>No Dispatches</EmptyTitle>
          <EmptyDescription>No active dispatches at the moment.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
