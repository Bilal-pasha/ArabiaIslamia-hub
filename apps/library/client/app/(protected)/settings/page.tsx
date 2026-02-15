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
} from '@arabiaaislamia/ui';
import { useLocale } from '@/lib/locale';
import { api } from '@/lib/api';
import { Plus, Trash2 } from 'lucide-react';

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('settings.title')}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{t('settings.title')}</p>
      </div>

      <div className="flex gap-2 border-b border-border">
        <button
          type="button"
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'authors' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          onClick={() => setActiveTab('authors')}
        >
          {t('settings.authors')}
        </button>
        <button
          type="button"
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'categories' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          onClick={() => setActiveTab('categories')}
        >
          {t('settings.categories')}
        </button>
      </div>

      {activeTab === 'authors' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
          <Card>
            <CardContent className="p-4 space-y-4">
              <form onSubmit={addAuthor} className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="new-author">{t('settings.authorName')}</Label>
                  <Input
                    id="new-author"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    dir="auto"
                    placeholder={t('settings.addAuthor')}
                  />
                </div>
                <div className="flex items-end">
                  <Button type="submit" className="gap-2">
                    <Plus className="h-4 w-4" aria-hidden />
                    {t('common.add')}
                  </Button>
                </div>
              </form>
              <div>
                {authors.length === 0 ? (
                  <p className="text-muted-foreground text-sm py-4">{t('settings.emptyAuthors')}</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('settings.authorName')}</TableHead>
                        <TableHead className="w-[80px]" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {authors.map((a) => (
                        <TableRow key={a.id}>
                          <TableCell dir="auto">{a.name}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteAuthor(a)}>
                              <Trash2 className="h-4 w-4" aria-hidden />
                            </Button>
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
            <CardContent className="p-4 space-y-4">
              <form onSubmit={addCategory} className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="new-category">{t('settings.categoryName')}</Label>
                  <Input
                    id="new-category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    dir="auto"
                    placeholder={t('settings.addCategory')}
                  />
                </div>
                <div className="flex items-end">
                  <Button type="submit" className="gap-2">
                    <Plus className="h-4 w-4" aria-hidden />
                    {t('common.add')}
                  </Button>
                </div>
              </form>
              <div>
                {categories.length === 0 ? (
                  <p className="text-muted-foreground text-sm py-4">{t('settings.emptyCategories')}</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('settings.categoryName')}</TableHead>
                        <TableHead className="w-[80px]" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell dir="auto">{c.name}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteCategory(c)}>
                              <Trash2 className="h-4 w-4" aria-hidden />
                            </Button>
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
    </div>
  );
}
