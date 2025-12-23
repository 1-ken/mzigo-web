"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CollectionManager } from "@/components/collections/collection-manager";

export default function CollectionsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">Collections</h1>
      </div>

      <div className="grid gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Collection Management</CardTitle>
          </CardHeader>
          <CardContent>
            <CollectionManager />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
