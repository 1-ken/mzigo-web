"use client";

import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

export function LoadingManager() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Manage loading operations for Mzigos.
      </p>
      <Empty>
        <EmptyHeader>
          <div className="text-4xl">⚙️</div>
          <EmptyTitle>No Loading Tasks</EmptyTitle>
          <EmptyDescription>No active loading tasks at the moment.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
