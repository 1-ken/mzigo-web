"use client";

import { ProfileContent } from "@/components/profile/profile-content";

export default function ProfilePage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">Profile</h1>
      </div>

      <ProfileContent />
    </div>
  );
}
