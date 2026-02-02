'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@arabiaaislamia/ui';
import { SecondaryLogo } from '@arabiaaislamia/ui';
import { fetchApplications, type AdmissionApplication } from '@/services/admission/admission.service';
import { fadeInUp, defaultTransition } from '@arabiaaislamia/animations';
import { publicRoutes, privateRoutes } from '@/constants/route';

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<AdmissionApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications()
      .then(setApplications)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={defaultTransition}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-amber-50/10"
    >
      <header className="sticky top-0 z-40 border-b border-border/50 bg-card/95 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0f2744] to-[#1e4a6f] p-1.5 shadow-md">
                <SecondaryLogo width={40} height={40} className="rounded-lg" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">Admission Applications</h1>
                <p className="text-muted-foreground text-xs">Secondary — Admin</p>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href={publicRoutes.form}>← Back to Form</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        {loading && (
          <div className="flex justify-center py-16">
            <div className="size-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-destructive">
            {error}
          </div>
        )}
        {!loading && !error && applications.length === 0 && (
          <Card className="shadow-md">
            <CardContent className="py-16 text-center text-muted-foreground">
              No applications yet.
            </CardContent>
          </Card>
        )}
        {!loading && !error && applications.length > 0 && (
          <div className="space-y-4">
            {applications.map((app, i) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={privateRoutes.applicationDetail(app.id)}>
                  <Card className="cursor-pointer transition-shadow hover:shadow-lg shadow-[0_2px_8px_-2px_rgba(15,39,68,0.08)]">
                    <CardHeader className="py-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-semibold">
                          {app.name} — {app.applicationNumber}
                        </CardTitle>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            app.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {app.requiredClass} • {app.email} • {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </CardHeader>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </motion.div>
  );
}
