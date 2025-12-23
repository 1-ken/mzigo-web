"use client";

import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

export function CollectionManager() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Manage and track Mzigo collections.
      </p>
      <Empty>
        <EmptyHeader>
          <div className="text-4xl">🎁</div>
          <EmptyTitle>No Collections</EmptyTitle>
          <EmptyDescription>No active collections at the moment.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
