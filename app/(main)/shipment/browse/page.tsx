"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShipmentBrowser } from "@/components/shipment-browse/shipment-browser";

export default function BrowseShipmentsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">Browse Mzigos</h1>
      </div>

      <div className="grid gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mzigo List</CardTitle>
          </CardHeader>
          <CardContent>
            <ShipmentBrowser />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
