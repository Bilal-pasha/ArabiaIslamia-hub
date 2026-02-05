'use client';

import Link from 'next/link';
import { LayoutDashboard, ImageIcon, LayoutList } from 'lucide-react';
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
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">Main website CMS — overview</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {quickLinks.map(({ href, label, icon: Icon, desc }) => (
          <Link key={href} href={href}>
            <Card className="border border-white/10 bg-white/5 backdrop-blur-xl transition-colors hover:border-amber-400/30 hover:bg-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg text-white">
                  <Icon className="size-5 text-amber-400" />
                  {label}
                </CardTitle>
                <p className="text-sm text-slate-400">{desc}</p>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="border border-white/10 bg-white/5 backdrop-blur-xl">
        <CardContent className="pt-6">
          <Link
            href={publicRoutes.home}
            className="text-sm text-slate-300 hover:text-white hover:underline"
          >
            ← View public website
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
