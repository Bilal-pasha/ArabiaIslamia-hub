'use client';

import Link from 'next/link';
import { ClipboardList, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@arabiaaislamia/ui';
import { privateRoutes, publicRoutes } from '@/constants/route';
import { useEffect, useState } from 'react';
import { apiClient } from '@/utils/axios-instance';

export default function AdminDashboardPage() {
  const [user, setUser] = useState<{ role?: string } | null>(null);

  useEffect(() => {
    apiClient
      .get<{ data: { user: { role?: string } } }>('/api/auth/me')
      .then((res) => setUser(res.data.data.user))
      .catch(() => setUser(null));
  }, []);

  return (
    <div className="space-y-6 w-full min-w-0 overflow-x-hidden">
      <div>
        <h2 className="text-slate-200 text-sm font-medium mb-1">Quick links</h2>
        <p className="text-slate-400 text-sm">Secondary admission admin</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 w-full min-w-0">
        <Card className="secondary-card border border-white/10 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <ClipboardList className="size-5" />
              Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-400 text-sm mb-4">
              View and manage admission applications. Approve, reject, and record oral test results.
            </p>
            <Link
              href={privateRoutes.applications}
              className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
            >
              Open applications
            </Link>
          </CardContent>
        </Card>
        {user?.role === 'superadmin' && (
          <Card className="secondary-card border border-white/10 backdrop-blur-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Users className="size-5" />
                Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 text-sm mb-4">
                Manage admin users. Add new admins who can access the admission panel.
              </p>
              <Link
                href={privateRoutes.users}
                className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 transition-colors"
              >
                Manage users
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
      <Card className="secondary-card border border-white/10 backdrop-blur-xl">
        <CardContent className="pt-6">
          <Link
            href={publicRoutes.form}
            className="text-sm text-slate-300 hover:text-white hover:underline"
          >
            ← Public registration form
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
