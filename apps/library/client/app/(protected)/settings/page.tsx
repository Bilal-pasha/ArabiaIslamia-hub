'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Button,
  Card,
  CardContent,
  Input,
  Label,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  useModal,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@arabiaaislamia/ui';
import { useLocale } from '@/lib/locale';
import { api } from '@/lib/api';
import { Plus, MoreVertical, Eye, Trash2 } from 'lucide-react';

type Author = { id: string; name: string };
type Category = { id: string; name: string };

export default function SettingsPage() {
  const { t } = useLocale();
  const router = useRouter();
  const modal = useModal();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<'authors' | 'categories'>('authors');
  const [newAuthor, setNewAuthor] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [viewItem, setViewItem] = useState<{ type: 'author' | 'category'; name: string; id: string } | null>(null);

  function fetchAuthors() {
    api.get('/api/book-authors').then((r) => setAuthors(r.data.data || []));
  }
  function fetchCategories() {
    api.get('/api/book-categories').then((r) => setCategories(r.data.data || []));
  }

  useEffect(() => {
    api.get<{ data: { user: { isSuperAdmin?: boolean } } }>('/api/auth/me').then((res) => {
      if (!res.data?.data?.user?.isSuperAdmin) router.replace('/');
    });
  }, [router]);
  useEffect(() => {
    fetchAuthors();
    fetchCategories();
  }, []);

  function addAuthor(e: React.FormEvent) {
    e.preventDefault();
    if (!newAuthor.trim()) return;
    api.post('/api/book-authors', { name: newAuthor.trim() }).then(() => {
      setNewAuthor('');
      fetchAuthors();
    });
  }

  function addCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCategory.trim()) return;
    api.post('/api/book-categories', { name: newCategory.trim() }).then(() => {
      setNewCategory('');
      fetchCategories();
    });
  }

  function deleteAuthor(author: Author) {
    modal.confirmation({
      title: t('books.delete'),
      description: `${t('settings.authorName')}: ${author.name}`,
      confirmText: t('common.confirm'),
      cancelText: t('common.cancel'),
      variant: 'destructive',
      onConfirm: async () => {
        await api.delete(`/api/book-authors/${author.id}`);
        fetchAuthors();
      },
    });
  }

  function deleteCategory(category: Category) {
    modal.confirmation({
      title: t('books.delete'),
      description: `${t('settings.categoryName')}: ${category.name}`,
      confirmText: t('common.confirm'),
      cancelText: t('common.cancel'),
      variant: 'destructive',
      onConfirm: async () => {
        await api.delete(`/api/book-categories/${category.id}`);
        fetchCategories();
      },
    });
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-foreground">{t('settings.title')}</h1>
      </div>

      <div className="flex gap-1 border-b border-border">
        <button
          type="button"
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${activeTab === 'authors' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          onClick={() => setActiveTab('authors')}
        >
          {t('settings.authors')}
        </button>
        <button
          type="button"
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${activeTab === 'categories' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          onClick={() => setActiveTab('categories')}
        >
          {t('settings.categories')}
        </button>
      </div>

      {activeTab === 'authors' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
          <Card>
            <CardContent className="p-6 space-y-6">
              <form onSubmit={addAuthor} className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 min-w-0">
                  <Label htmlFor="new-author" className="mb-2 block text-sm font-medium text-card-foreground/90">
                    {t('settings.authorName')}
                  </Label>
                  <Input
                    id="new-author"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    dir="auto"
                    placeholder={t('settings.addAuthor')}
                  />
                </div>
                <div className="flex items-end">
                  <Button type="submit" className="gap-2 w-full sm:w-auto">
                    <Plus className="h-4 w-4 shrink-0" aria-hidden />
                    {t('common.add')}
                  </Button>
                </div>
              </form>
              <div className="rounded-lg border border-border overflow-hidden">
                {authors.length === 0 ? (
                  <p className="text-muted-foreground text-sm py-8 px-4 text-center">{t('settings.emptyAuthors')}</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="h-12 px-4 sm:px-6 font-medium bg-muted/50">{t('settings.authorName')}</TableHead>
                        <TableHead className="w-[60px] sm:w-[72px] bg-muted/50" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {authors.map((a) => (
                        <TableRow key={a.id} className="group">
                          <TableCell dir="auto" className="py-4 px-4 sm:px-6 align-middle">
                            {a.name}
                          </TableCell>
                          <TableCell className="py-2 px-4 sm:px-6">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="ghost" className="h-9 w-9 p-0" aria-label={t('common.view')}>
                                  <MoreVertical className="h-4 w-4" aria-hidden />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="min-w-[140px] bg-white border-border">
                                <DropdownMenuItem onClick={() => setViewItem({ type: 'author', name: a.name, id: a.id })} className="gap-2">
                                  <Eye className="h-4 w-4" aria-hidden />
                                  {t('common.view')}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => deleteAuthor(a)}
                                  className="gap-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                                >
                                  <Trash2 className="h-4 w-4" aria-hidden />
                                  {t('books.delete')}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {activeTab === 'categories' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
          <Card>
            <CardContent className="p-6 space-y-6">
              <form onSubmit={addCategory} className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 min-w-0">
                  <Label htmlFor="new-category" className="mb-2 block text-sm font-medium text-card-foreground/90">
                    {t('settings.categoryName')}
                  </Label>
                  <Input
                    id="new-category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    dir="auto"
                    placeholder={t('settings.addCategory')}
                  />
                </div>
                <div className="flex items-end">
                  <Button type="submit" className="gap-2 w-full sm:w-auto">
                    <Plus className="h-4 w-4 shrink-0" aria-hidden />
                    {t('common.add')}
                  </Button>
                </div>
              </form>
              <div className="rounded-lg border border-border overflow-hidden">
                {categories.length === 0 ? (
                  <p className="text-muted-foreground text-sm py-8 px-4 text-center">{t('settings.emptyCategories')}</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="h-12 px-4 sm:px-6 font-medium bg-muted/50">{t('settings.categoryName')}</TableHead>
                        <TableHead className="w-[60px] sm:w-[72px] bg-muted/50" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.map((c) => (
                        <TableRow key={c.id} className="group">
                          <TableCell dir="auto" className="py-4 px-4 sm:px-6 align-middle">
                            {c.name}
                          </TableCell>
                          <TableCell className="py-2 px-4 sm:px-6">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="ghost" className="h-9 w-9 p-0" aria-label={t('common.view')}>
                                  <MoreVertical className="h-4 w-4" aria-hidden />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start" className="min-w-[140px] bg-white border-border">
                                <DropdownMenuItem onClick={() => setViewItem({ type: 'category', name: c.name, id: c.id })} className="gap-2">
                                  <Eye className="h-4 w-4" aria-hidden />
                                  {t('common.view')}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => deleteCategory(c)}
                                  className="gap-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                                >
                                  <Trash2 className="h-4 w-4" aria-hidden />
                                  {t('books.delete')}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <Dialog open={!!viewItem} onOpenChange={(open) => !open && setViewItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {viewItem?.type === 'author' ? t('settings.authorName') : t('settings.categoryName')}
            </DialogTitle>
          </DialogHeader>
          {viewItem && (
            <div className="space-y-2 py-2">
              <p className="text-foreground font-medium" dir="auto">{viewItem.name}</p>
              <p className="text-muted-foreground text-xs font-mono">{viewItem.id}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
