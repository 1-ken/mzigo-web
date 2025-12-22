"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Phone, 
  Shield, 
  MapPin, 
  Building2,
  CheckCircle2
} from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();

  if (!session) return null;

  const user = session.user;
  const role = (session as any).role;
  const branch = (session as any).branch;

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <div className="min-h-screen w-full p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Welcome Back!
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            View your account information and access rights
          </p>
        </div>

        {/* User Profile Card */}
        {/* <Card className="overflow-hidden">
          <CardHeader className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
              <Avatar className="h-20 w-20 border-4 border-white shadow-lg dark:border-gray-800">
                <AvatarFallback className="bg-linear-to-br from-blue-500 to-indigo-600 text-xl font-bold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <CardDescription className="flex items-center justify-center gap-2 sm:justify-start">
                  <Phone className="h-4 w-4" />
                  {user.phone}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card> */}

        {/* User Information Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Role Information */}
          {/* <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                <CardTitle className="text-lg">Role Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Role Name</p>
                <Badge variant="default" className="text-sm font-semibold">
                  {role?.name || "N/A"}
                </Badge>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Rank</p>
                <p className="font-medium">{role?.rank || "N/A"}</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Role ID</p>
                <p className="font-mono text-xs text-muted-foreground">
                  {role?.id || "N/A"}
                </p>
              </div>
            </CardContent>
          </Card> */}

          {/* Branch Information */}
          {/* <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-green-500" />
                <CardTitle className="text-lg">Branch Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Branch Name</p>
                <p className="font-semibold text-lg">{branch?.name || "N/A"}</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">County Code</p>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{branch?.county_code || "N/A"}</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Branch ID</p>
                <p className="font-mono text-xs text-muted-foreground">
                  {branch?.id || "N/A"}
                </p>
              </div>
            </CardContent>
          </Card> */}
        </div>

        {/* Access Rights Summary */}
        {/* <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <CardTitle>Access Rights Summary</CardTitle>
            </div>
            <CardDescription>
              Your current system permissions and access level
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border bg-card p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">User ID</p>
                    <p className="font-mono text-sm font-medium">{user.id}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border bg-card p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Role</p>
                    <p className="text-sm font-medium">{role?.name || "N/A"}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border bg-card p-4 shadow-sm sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Branch</p>
                    <p className="text-sm font-medium">{branch?.name || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                You are logged in with <strong>{role?.name}</strong> role privileges.
                {branch?.name && (
                  <> Your operations are scoped to the <strong>{branch.name}</strong> branch.</>
                )}
              </p>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
