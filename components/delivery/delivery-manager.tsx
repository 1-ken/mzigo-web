"use client";

import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

export function DeliveryManager() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Manage and track deliveries assigned to you.
      </p>
      <Empty>
        <EmptyHeader>
          <div className="text-4xl">🚚</div>
          <EmptyTitle>No Deliveries</EmptyTitle>
          <EmptyDescription>No active deliveries at the moment.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
