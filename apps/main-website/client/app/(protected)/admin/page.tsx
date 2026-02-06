'use client';

import Link from 'next/link';
import { ImageIcon, LayoutList } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@arabiaaislamia/ui';
import { adminRoutes, publicRoutes } from '@/constants/route';

const quickLinks = [
  { href: adminRoutes.hero, label: 'Hero carousel', icon: ImageIcon, desc: 'Manage hero slides and images' },
  { href: adminRoutes.sections, label: 'Sections', icon: LayoutList, desc: 'Edit home page sections' },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-amber-950">Dashboard</h1>
        <p className="mt-1 text-sm text-amber-700">Main website CMS — overview</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {quickLinks.map(({ href, label, icon: Icon, desc }) => (
          <Link key={href} href={href}>
            <Card className="border border-amber-200/80 bg-white/80 shadow-sm transition-colors hover:border-amber-300 hover:bg-white hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg text-amber-950">
                  <Icon className="size-5 text-primary" />
                  {label}
                </CardTitle>
                <p className="text-sm text-amber-700">{desc}</p>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="border border-amber-200/80 bg-white/80 shadow-sm">
        <CardContent className="pt-6">
          <Link
            href={publicRoutes.home}
            className="text-sm text-primary hover:underline"
          >
            ← View public website
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
