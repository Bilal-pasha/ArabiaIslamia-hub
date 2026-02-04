'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
} from '@arabiaaislamia/ui';
import { fadeInUp, defaultTransition } from '@arabiaaislamia/animations';
import { apiClient } from '@/utils/axios-instance';
import { privateRoutes } from '@/constants/route';

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const fetchUsers = () => {
    setLoading(true);
    setError(null);
    apiClient
      .get<{ data: { users: UserRow[] } }>('/api/auth/users')
      .then((res) => setUsers(res.data.data.users))
      .catch((err) => {
        const status = (err as { response?: { status?: number } })?.response?.status;
        if (status === 403) router.replace(privateRoutes.dashboard);
        else setError(err instanceof Error ? err.message : 'Failed to load');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      await apiClient.post('/api/auth/admins', { name: name.trim(), email: email.toLowerCase().trim(), password });
      setName('');
      setEmail('');
      setPassword('');
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to create admin');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={defaultTransition}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Users</h2>
          <p className="text-slate-400 text-sm">Manage admin users. Only superadmin can add new admins.</p>
        </div>
        <Button
          type="button"
          onClick={() => setShowForm(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white shrink-0"
        >
          Add admin
        </Button>
      </div>

      {showForm && (
        <Card className="secondary-card border border-white/10 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-white">New admin</CardTitle>
            <p className="text-slate-400 text-sm">Password must include uppercase, lowercase, number, and special character.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddAdmin} className="space-y-4 max-w-md">
              <div>
                <Label htmlFor="admin-name" className="mb-1.5 block text-slate-200">Name</Label>
                <Input
                  id="admin-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-slate-500"
                  placeholder="Full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="admin-email" className="mb-1.5 block text-slate-200">Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-slate-500"
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="admin-password" className="mb-1.5 block text-slate-200">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-slate-500"
                  placeholder="Min 8 characters"
                  required
                  minLength={8}
                />
              </div>
              {formError && (
                <p className="text-sm text-red-300">{formError}</p>
              )}
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {submitting ? 'Creating...' : 'Create admin'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setShowForm(false); setFormError(null); }}
                  className="border-white/20 text-slate-200 hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="secondary-card border border-white/10 backdrop-blur-xl overflow-hidden">
        {loading ? (
          <CardContent className="py-16 flex justify-center">
            <div className="size-10 animate-spin rounded-full border-2 border-orange-400 border-t-transparent" />
          </CardContent>
        ) : error ? (
          <CardContent className="py-8">
            <p className="text-red-300">{error}</p>
          </CardContent>
        ) : users.length === 0 ? (
          <CardContent className="py-16 text-center text-slate-400">
            No users found.
          </CardContent>
        ) : (
          <>
            <CardHeader className="border-b border-white/10">
              <CardTitle className="text-white">All users</CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <Table className="min-w-[420px]">
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableHead className="text-slate-200">Name</TableHead>
                    <TableHead className="text-slate-200">Email</TableHead>
                    <TableHead className="text-slate-200">Role</TableHead>
                    <TableHead className="text-slate-200">Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="text-slate-200 font-medium">{u.name}</TableCell>
                      <TableCell className="text-slate-300">{u.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={u.role === 'superadmin' ? 'approved' : u.role === 'admin' ? 'pending' : 'rejected'}
                          className="capitalize"
                        >
                          {u.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-400 text-sm">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </Card>
    </motion.div>
  );
}
