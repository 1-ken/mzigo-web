"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CreateShipmentForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    // Sender Details
    senderName: "",
    senderPhone: "",
    senderLocation: "",
    // Receiver Details
    receiverName: "",
    receiverPhone: "",
    destinationOffice: "",
    // Mzigo Details
    description: "",
    value: "",
    vehicle: "",
    // Payment Details
    deliveryAmount: "",
    paymentMethod: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Build the payload
    const payload = {
      sender: {
        name: formData.senderName,
        phone: formData.senderPhone,
        location: formData.senderLocation,
      },
      receiver: {
        name: formData.receiverName,
        phone: formData.receiverPhone,
        destinationOffice: formData.destinationOffice,
      },
      mzigoDetails: {
        description: formData.description,
        value: formData.value,
        vehicle: formData.vehicle,
      },
      paymentDetails: {
        deliveryAmount: formData.deliveryAmount,
        paymentMethod: formData.paymentMethod,
      },
    };

    console.log("Mzigo Payload:", payload);

    // Simulate API call with 1.5 second delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Redirect to dashboard
    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Sender Details Section */}
      <Card className="border shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="text-lg">Sender Details</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="senderName">Name</Label>
              <Input
                id="senderName"
                name="senderName"
                placeholder="Name"
                value={formData.senderName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senderPhone">Phone</Label>
              <Input
                id="senderPhone"
                name="senderPhone"
                type="tel"
                placeholder="Contact"
                value={formData.senderPhone}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="senderLocation">Location</Label>
            <Input
              id="senderLocation"
              name="senderLocation"
              placeholder="MWEA"
              value={formData.senderLocation}
              onChange={handleChange}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Receiver Details Section */}
      <Card className="border shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="text-lg">Receiver Details</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="receiverName">Name</Label>
              <Input
                id="receiverName"
                name="receiverName"
                placeholder="Receiver Name"
                value={formData.receiverName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="receiverPhone">Phone</Label>
              <Input
                id="receiverPhone"
                name="receiverPhone"
                type="tel"
                placeholder="Receiver Phone"
                value={formData.receiverPhone}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="destinationOffice">Destination Office</Label>
            <select
              id="destinationOffice"
              name="destinationOffice"
              value={formData.destinationOffice}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white text-black rounded border border-input"
            >
              <option value="">Choose</option>
              <option value="office1">Office 1</option>
              <option value="office2">Office 2</option>
              <option value="office3">Office 3</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Mzigo Details Section */}
      <Card className="border shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="text-lg">Mzigo Details</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 bg-white text-foreground rounded border border-input resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="value">Value</Label>
            <Input
              id="value"
              name="value"
              type="number"
              placeholder="Value"
              value={formData.value}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="vehicle">Vehicle</Label>
            <select
              id="vehicle"
              name="vehicle"
              value={formData.vehicle}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white text-black rounded border border-input"
            >
              <option value="">Choose</option>
              <option value="bike">Bike</option>
              <option value="car">Car</option>
              <option value="van">Van</option>
              <option value="truck">Truck</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Payment Details Section */}
      <Card className="border shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="text-lg">Payment Details</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deliveryAmount">Delivery Amount</Label>
              <Input
                id="deliveryAmount"
                name="deliveryAmount"
                type="number"
                placeholder="Amount Charged"
                value={formData.deliveryAmount}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white text-black rounded border border-input"
              >
                <option value="">Choose</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="mpesa">M-Pesa</option>
                <option value="bank">Bank Transfer</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button 
        type="submit" 
        className="w-full py-2"
        disabled={isLoading}
      >
        {isLoading ? "Creating Mzigo..." : "Create Mzigo"}
      </Button>
    </form>
  );
}
