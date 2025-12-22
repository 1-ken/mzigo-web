"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import {
  HomeModernIcon,
  UsersIcon,
  DocumentTextIcon,
  HeartIcon,
  CurrencyDollarIcon,
  FolderIcon,
  DocumentPlusIcon,
  CommandLineIcon,
  SpeakerWaveIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data for teams.
const teams = [
  {
    name: "Acme Inc",
    logo: BuildingOfficeIcon,
    plan: "Enterprise",
  },
  {
    name: "Acme Corp.",
    logo: SpeakerWaveIcon,
    plan: "Startup",
  },
  {
    name: "Evil Corp.",
    logo: CommandLineIcon,
    plan: "Free",
  },
]

const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: HomeModernIcon,
    isActive: true,
  },
  {
    title: "Members",
    url: "/members",
    icon: UsersIcon,
    items: [
      {
        title: "Create New",
        url: "/members/create",
      },
      {
        title: "List",
        url: "/members/list",
      },
    ],
  },
  {
    title: "Sitrep",
    url: "/sitrep",
    icon: DocumentTextIcon,
    items: [
      {
        title: "Create New",
        url: "/sitrep/create",
      },
      {
        title: "List",
        url: "/sitrep/list",
      },
    ],
  },
  {
    title: "Benevolence",
    url: "/benevolence",
    icon: HeartIcon,
    items: [
      {
        title: "Create New",
        url: "/benevolence/create",
      },
      {
        title: "List",
        url: "/benevolence/list",
      },
    ],
  },
  {
    title: "Financial assistance",
    url: "/financial-assistance",
    icon: CurrencyDollarIcon,
    items: [
      {
        title: "Create New",
        url: "/financial-assistance/create",
      },
      {
        title: "List",
        url: "/financial-assistance/list",
      },
    ],
  },
]

const projects = [
  {
    name: "Project Management",
    url: "/project-management",
    icon: FolderIcon,
    items: [
      {
        title: "Create New",
        url: "/project-management/create",
      },
      {
        title: "List",
        url: "/project-management/list",
      },
    ],
  },
  {
    name: "Project Proposals",
    url: "/project-proposals",
    icon: DocumentPlusIcon,
    items: [
      {
        title: "Create New",
        url: "/project-proposals/create",
      },
      {
        title: "List",
        url: "/project-proposals/list",
      },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()

  // Get user data from session or use defaults
  const user = session?.user
    ? {
        name: session.user.name || "User",
        email: session.user.phone || session.user.email || "",
        avatar: session.user.image || "",
      }
    : {
        name: "User",
        email: "",
        avatar: "",
      }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavProjects projects={projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
