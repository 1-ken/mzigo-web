"use client";

import { useSession, signOut } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, User } from "lucide-react";

export function ProfileContent() {
  const { data: session } = useSession();
  return (
    <div className="grid gap-4 md:gap-6">
      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <div className="flex-1 space-y-3 text-center sm:text-left">
              <div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span className="text-sm">Name</span>
                </div>
                <p className="mt-1 text-lg font-semibold">
                  {session?.user?.name || "Not available"}
                </p>
              </div>
              {session?.user?.email && (
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">Email</span>
                  </div>
                  <p className="mt-1">{session.user.email}</p>
                </div>
              )}
              {session?.user?.phone && (
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">Phone</span>
                  </div>
                  <p className="mt-1">{session.user.phone}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card> 
    </div>
  );
}
