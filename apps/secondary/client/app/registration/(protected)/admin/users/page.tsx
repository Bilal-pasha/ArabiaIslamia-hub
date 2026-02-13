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
  TableSkeleton,
  toast,
  useModal,
} from '@arabiaaislamia/ui';
import { Trash2 } from 'lucide-react';
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
  const modal = useModal();

  const fetchUsers = () => {
    setLoading(true);
    setError(null);
    apiClient
      .get<{ data: { users: UserRow[] } }>('/api/auth/users')
      .then((res) => setUsers(res.data.data.users))
      .catch((err) => {
        const status = (err as { response?: { status?: number } })?.response?.status;
        if (status === 403) router.replace(privateRoutes.dashboard);
        else {
          const msg = err instanceof Error ? err.message : 'Failed to load';
          setError(msg);
          toast.error(msg);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInviteAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      await apiClient.post('/api/auth/invite-admin', { name: name.trim(), email: email.toLowerCase().trim() });
      setName('');
      setEmail('');
      setShowForm(false);
      fetchUsers();
      toast.success('Invite sent – they will receive an email to set their password');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to send invite';
      setFormError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (u: UserRow) => {
    modal.confirmation({
      title: 'Delete admin?',
      description: `This will permanently remove ${u.name} (${u.email}) from the system. This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'destructive',
      contentClassName: 'border-white/10 bg-slate-800/95 text-white',
      cancelClassName: 'border-white/20 bg-white/5 text-slate-200 hover:bg-white/10',
      confirmIcon: <Trash2 className="h-4 w-4" />,
      onConfirm: async () => {
        await apiClient.delete(`/api/auth/admins/${u.id}`);
        fetchUsers();
        toast.success('Admin deleted');
      },
    });
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
          Invite admin
        </Button>
      </div>

      {showForm && (
        <Card className="secondary-card border border-white/10 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-white">Invite admin</CardTitle>
            <p className="text-slate-400 text-sm">They will receive an email with a link to set their password.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInviteAdmin} className="space-y-4 max-w-md">
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
              {formError && (
                <p className="text-sm text-red-300">{formError}</p>
              )}
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {submitting ? 'Sending invite...' : 'Send invite'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setShowForm(false); setFormError(null); }}
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
          <TableSkeleton numberOfRows={6} className="border-0" />
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
                    <TableHead className="text-slate-200 text-right w-[100px]">Actions</TableHead>
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
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          onClick={() => handleDeleteClick(u)}
                          aria-label={`Delete ${u.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
