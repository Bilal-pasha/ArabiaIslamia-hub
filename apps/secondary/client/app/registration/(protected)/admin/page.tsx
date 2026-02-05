'use client';

import Link from 'next/link';
import { ClipboardList, Users, GraduationCap, RefreshCw, FileText, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, toast } from '@arabiaaislamia/ui';
import { privateRoutes, publicRoutes } from '@/constants/route';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, defaultTransition } from '@arabiaaislamia/animations';
import { fetchAdmissionStats, type AdmissionStatsDto } from '@/services/admission/admission.service';
import { apiClient } from '@/utils/axios-instance';

function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  href,
  colorClass,
}: {
  title: string;
  value: number;
  subtext?: string;
  icon: React.ElementType;
  href: string;
  colorClass: string;
}) {
  return (
    <Link href={href}>
      <motion.div
        variants={fadeInUp}
        transition={defaultTransition}
        className={`group rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 ${colorClass}`}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium">{title}</p>
            <p className="text-3xl font-bold text-white mt-1">{value}</p>
            {subtext != null && <p className="text-slate-400 text-xs mt-1">{subtext}</p>}
          </div>
          <div className="rounded-lg bg-white/10 p-2.5 group-hover:bg-white/20 transition-colors">
            <Icon className="size-6 text-white" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

function BarSegment({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="text-slate-300 text-sm w-24 shrink-0">{label}</span>
      <div className="flex-1 h-6 rounded-md bg-white/10 overflow-hidden">
        <div
          className={`h-full rounded-md transition-all duration-500 ${color}`}
          style={{ width: `${pct}%`, minWidth: count > 0 ? '4px' : 0 }}
        />
      </div>
      <span className="text-white text-sm font-medium w-8 text-right">{count}</span>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [user, setUser] = useState<{ role?: string } | null>(null);
  const [stats, setStats] = useState<AdmissionStatsDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<{ data: { user: { role?: string } } }>('/api/auth/me')
      .then((res) => setUser(res.data.data.user))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    fetchAdmissionStats()
      .then(setStats)
      .catch((err) => {
        toast.error(err instanceof Error ? err.message : 'Failed to load stats');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="space-y-8 w-full min-w-0 overflow-x-hidden"
    >
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Secondary admission — overview</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Applications"
          value={stats?.applications?.total ?? 0}
          subtext={stats ? `${stats.applications.pending} pending` : undefined}
          icon={FileText}
          href={privateRoutes.applications}
          colorClass="hover:border-orange-400/30"
        />
        <StatCard
          title="New students"
          value={stats?.students ?? 0}
          subtext="Converted from applications"
          icon={GraduationCap}
          href={privateRoutes.students}
          colorClass="hover:border-emerald-400/30"
        />
        <StatCard
          title="Renewals"
          value={stats?.renewals?.total ?? 0}
          subtext={stats ? `${stats.renewals.pending} pending` : undefined}
          icon={RefreshCw}
          href={privateRoutes.renewals}
          colorClass="hover:border-amber-400/30"
        />
        <StatCard
          title="Pending review"
          value={(stats?.applications?.pending ?? 0) + (stats?.renewals?.pending ?? 0)}
          subtext="Applications + renewals"
          icon={TrendingUp}
          href={privateRoutes.applications}
          colorClass="hover:border-sky-400/30"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="secondary-card border border-white/10 backdrop-blur-xl overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <ClipboardList className="size-5" />
              Application status
            </CardTitle>
            <p className="text-slate-400 text-sm">Breakdown of admission applications</p>
          </CardHeader>
          <CardContent className="space-y-2">
            {loading ? (
              <div className="space-y-3 py-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-6 rounded bg-white/10 animate-pulse" />
                ))}
              </div>
            ) : stats ? (
              <>
                <BarSegment
                  label="Pending"
                  count={stats.applications.pending}
                  total={stats.applications.total}
                  color="bg-amber-500"
                />
                <BarSegment
                  label="Approved"
                  count={stats.applications.approved}
                  total={stats.applications.total}
                  color="bg-sky-500"
                />
                <BarSegment
                  label="Rejected"
                  count={stats.applications.rejected}
                  total={stats.applications.total}
                  color="bg-red-500"
                />
                <BarSegment
                  label="Student"
                  count={stats.applications.student}
                  total={stats.applications.total}
                  color="bg-emerald-500"
                />
              </>
            ) : null}
          </CardContent>
        </Card>

        <Card className="secondary-card border border-white/10 backdrop-blur-xl overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <RefreshCw className="size-5" />
              Renewal status
            </CardTitle>
            <p className="text-slate-400 text-sm">Breakdown of renewal applications</p>
          </CardHeader>
          <CardContent className="space-y-2">
            {loading ? (
              <div className="space-y-3 py-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-6 rounded bg-white/10 animate-pulse" />
                ))}
              </div>
            ) : stats ? (
              <>
                <BarSegment
                  label="Pending"
                  count={stats.renewals.pending}
                  total={stats.renewals.total}
                  color="bg-amber-500"
                />
                <BarSegment
                  label="Approved"
                  count={stats.renewals.approved}
                  total={stats.renewals.total}
                  color="bg-emerald-500"
                />
                <BarSegment
                  label="Rejected"
                  count={stats.renewals.rejected}
                  total={stats.renewals.total}
                  color="bg-red-500"
                />
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>

      {/* Quick links */}
      <Card className="secondary-card border border-white/10 backdrop-blur-xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-white">Quick links</CardTitle>
          <p className="text-slate-400 text-sm">Secondary admission admin</p>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href={privateRoutes.applications}
            className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/10 hover:border-orange-400/30 transition-all"
          >
            <ClipboardList className="size-5 text-orange-400" />
            <span className="font-medium text-white">Applications</span>
          </Link>
          <Link
            href={privateRoutes.renewals}
            className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/10 hover:border-amber-400/30 transition-all"
          >
            <RefreshCw className="size-5 text-amber-400" />
            <span className="font-medium text-white">Renewals</span>
          </Link>
          <Link
            href={privateRoutes.students}
            className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/10 hover:border-emerald-400/30 transition-all"
          >
            <GraduationCap className="size-5 text-emerald-400" />
            <span className="font-medium text-white">Students</span>
          </Link>
          {user?.role === 'superadmin' && (
            <Link
              href={privateRoutes.users}
              className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/10 hover:border-sky-400/30 transition-all"
            >
              <Users className="size-5 text-sky-400" />
              <span className="font-medium text-white">Users</span>
            </Link>
          )}
        </CardContent>
      </Card>

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
    </motion.div>
  );
}
