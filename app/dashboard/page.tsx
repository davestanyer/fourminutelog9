"use client";

import Link from "next/link";
import { Clock, Users, Briefcase, RotateCcw } from "lucide-react";
import { Header } from "@/components/header";

const items = [
  {
    href: "/log",
    icon: <Clock className="h-8 w-8" />,
    title: "Daily Log",
    description: "Track your daily activities and tasks",
  },
  {
    href: "/clients",
    icon: <Briefcase className="h-8 w-8" />,
    title: "Clients",
    description: "Manage your client relationships",
  },
  {
    href: "/team",
    icon: <Users className="h-8 w-8" />,
    title: "Team",
    description: "Collaborate with your team members",
  },
  {
    href: "/recurring",
    icon: <RotateCcw className="h-8 w-8" />,
    title: "Recurring Tasks",
    description: "Manage recurring activities",
  },
];

export default function Dashboard() {
  return (
    <div>
      <Header title="Daily activity log" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link key={item.href} href={item.href}>
            <div className="p-6 bg-card rounded-lg shadow-sm border space-y-2 hover:shadow-md transition-shadow cursor-pointer">
              {item.icon}
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
