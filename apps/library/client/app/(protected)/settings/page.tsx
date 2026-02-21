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
import { fadeInUp, staggerContainer, defaultTransition } from '@arabiaaislamia/animations';
import { useLocale } from '@/lib/locale';
import { api } from '@/lib/api';
import { Plus, MoreVertical, Eye, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 10;

type Author = { id: string; name: string };
type Category = { id: string; name: string };
type Nashir = { id: string; name: string };

export default function SettingsPage() {
  const { t } = useLocale();
  const router = useRouter();
  const modal = useModal();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [nashirs, setNashirs] = useState<Nashir[]>([]);
  const [activeTab, setActiveTab] = useState<'authors' | 'categories' | 'nashirs'>('authors');
  const [newAuthor, setNewAuthor] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newNashir, setNewNashir] = useState('');
  const [viewItem, setViewItem] = useState<{ type: 'author' | 'category' | 'nashir'; name: string; id: string } | null>(null);
  const [authorPage, setAuthorPage] = useState(1);
  const [categoryPage, setCategoryPage] = useState(1);
  const [nashirPage, setNashirPage] = useState(1);

  function fetchAuthors() {
    api.get('/api/book-authors').then((r) => setAuthors(r.data.data || []));
  }
  function fetchCategories() {
    api.get('/api/book-categories').then((r) => setCategories(r.data.data || []));
  }
  function fetchNashirs() {
    api.get('/api/book-nashirs').then((r) => setNashirs(r.data.data || []));
  }

  useEffect(() => {
    api.get<{ data: { user: { isSuperAdmin?: boolean } } }>('/api/auth/me').then((res) => {
      if (!res.data?.data?.user?.isSuperAdmin) router.replace('/');
    });
  }, [router]);
  useEffect(() => {
    fetchAuthors();
    fetchCategories();
    fetchNashirs();
  }, []);

  const authorTotalPages = Math.max(1, Math.ceil(authors.length / PAGE_SIZE));
  const categoryTotalPages = Math.max(1, Math.ceil(categories.length / PAGE_SIZE));
  const nashirTotalPages = Math.max(1, Math.ceil(nashirs.length / PAGE_SIZE));
  useEffect(() => {
    if (authorPage > authorTotalPages) setAuthorPage(authorTotalPages);
  }, [authorPage, authorTotalPages]);
  useEffect(() => {
    if (categoryPage > categoryTotalPages) setCategoryPage(categoryTotalPages);
  }, [categoryPage, categoryTotalPages]);
  useEffect(() => {
    if (nashirPage > nashirTotalPages) setNashirPage(nashirTotalPages);
  }, [nashirPage, nashirTotalPages]);

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

  function addNashir(e: React.FormEvent) {
    e.preventDefault();
    if (!newNashir.trim()) return;
    api.post('/api/book-nashirs', { name: newNashir.trim() }).then(() => {
      setNewNashir('');
      fetchNashirs();
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

  function deleteNashir(nashir: Nashir) {
    modal.confirmation({
      title: t('books.delete'),
      description: `${t('settings.nashirName')}: ${nashir.name}`,
      confirmText: t('common.confirm'),
      cancelText: t('common.cancel'),
      variant: 'destructive',
      onConfirm: async () => {
        await api.delete(`/api/book-nashirs/${nashir.id}`);
        fetchNashirs();
      },
    });
  }

  return (
    <motion.div
      className="space-y-8"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      transition={defaultTransition}
    >
      <motion.div variants={fadeInUp} className="flex flex-col">
        <h1 className="text-2xl font-bold text-foreground">{t('settings.title')}</h1>
      </motion.div>

      <motion.div variants={fadeInUp} className="flex gap-1 border-b border-border">
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
        <button
          type="button"
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${activeTab === 'nashirs' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          onClick={() => setActiveTab('nashirs')}
        >
          {t('settings.nashirs')}
        </button>
      </motion.div>

      {activeTab === 'authors' && (
        <motion.div variants={fadeInUp}>
          <Card>
            <CardContent className="p-6 space-y-6">
              <form onSubmit={addAuthor} className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 min-w-0">
                  <Label htmlFor="new-author" className="mb-2 block font-medium text-card-foreground/90">
                    {t('settings.authorName')}
                  </Label>
                  <Input
                    id="new-author"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    dir="rtl"
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
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent border-b border-border">
                          <TableHead className="h-12 px-4 sm:px-6 font-medium">{t('settings.authorName')}</TableHead>
                          <TableHead className="w-[60px] sm:w-[72px]" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {authors.slice((authorPage - 1) * PAGE_SIZE, authorPage * PAGE_SIZE).map((a) => (
                        <TableRow key={a.id} className="group">
                          <TableCell dir="rtl" className="py-4 px-4 sm:px-6 align-middle">
                            {a.name}
                          </TableCell>
                          <TableCell className="py-2 px-4 sm:px-6">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="ghost" className="h-9 w-9 p-0" aria-label={t('common.view')}>
                                  <MoreVertical className="h-4 w-4" aria-hidden />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="min-w-[140px]">
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
                    {authors.length > PAGE_SIZE && (
                      <div className="flex items-center justify-between border-t border-border px-4 sm:px-6 py-3 text-sm bg-muted/30">
                        <span className="text-muted-foreground">{t('common.page')} {authorPage} {t('common.of')} {authorTotalPages} ({authors.length})</span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" disabled={authorPage <= 1} onClick={() => setAuthorPage((p) => Math.max(1, p - 1))}>
                            <ChevronLeft className="h-4 w-4" aria-hidden />
                          </Button>
                          <Button size="sm" variant="outline" disabled={authorPage >= authorTotalPages} onClick={() => setAuthorPage((p) => p + 1)}>
                            <ChevronRight className="h-4 w-4" aria-hidden />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {activeTab === 'nashirs' && (
        <motion.div variants={fadeInUp}>
          <Card>
            <CardContent className="p-6 space-y-6">
              <form onSubmit={addNashir} className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 min-w-0">
                  <Label htmlFor="new-nashir" className="mb-2 block font-medium text-card-foreground/90">
                    {t('settings.nashirName')}
                  </Label>
                  <Input
                    id="new-nashir"
                    value={newNashir}
                    onChange={(e) => setNewNashir(e.target.value)}
                    dir="rtl"
                    placeholder={t('settings.addNashir')}
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
                {nashirs.length === 0 ? (
                  <p className="text-muted-foreground text-sm py-8 px-4 text-center">{t('settings.emptyNashirs')}</p>
                ) : (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent border-b border-border">
                          <TableHead className="h-12 px-4 sm:px-6 font-medium">{t('settings.nashirName')}</TableHead>
                          <TableHead className="w-[60px] sm:w-[72px]" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {nashirs.slice((nashirPage - 1) * PAGE_SIZE, nashirPage * PAGE_SIZE).map((n) => (
                        <TableRow key={n.id} className="group">
                          <TableCell dir="rtl" className="py-4 px-4 sm:px-6 align-middle">
                            {n.name}
                          </TableCell>
                          <TableCell className="py-2 px-4 sm:px-6">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="ghost" className="h-9 w-9 p-0" aria-label={t('common.view')}>
                                  <MoreVertical className="h-4 w-4" aria-hidden />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start" className="min-w-[140px]">
                                <DropdownMenuItem onClick={() => setViewItem({ type: 'nashir', name: n.name, id: n.id })} className="gap-2">
                                  <Eye className="h-4 w-4" aria-hidden />
                                  {t('common.view')}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => deleteNashir(n)}
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
                    {nashirs.length > PAGE_SIZE && (
                      <div className="flex items-center justify-between border-t border-border px-4 sm:px-6 py-3 text-sm bg-muted/30">
                        <span className="text-muted-foreground">{t('common.page')} {nashirPage} {t('common.of')} {nashirTotalPages} ({nashirs.length})</span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" disabled={nashirPage <= 1} onClick={() => setNashirPage((p) => Math.max(1, p - 1))}>
                            <ChevronLeft className="h-4 w-4" aria-hidden />
                          </Button>
                          <Button size="sm" variant="outline" disabled={nashirPage >= nashirTotalPages} onClick={() => setNashirPage((p) => p + 1)}>
                            <ChevronRight className="h-4 w-4" aria-hidden />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {activeTab === 'categories' && (
        <motion.div variants={fadeInUp}>
          <Card>
            <CardContent className="p-6 space-y-6">
              <form onSubmit={addCategory} className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 min-w-0">
                  <Label htmlFor="new-category" className="mb-2 block font-medium text-card-foreground/90">
                    {t('settings.categoryName')}
                  </Label>
                  <Input
                    id="new-category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    dir="rtl"
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
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent border-b border-border">
                          <TableHead className="h-12 px-4 sm:px-6 font-medium">{t('settings.categoryName')}</TableHead>
                          <TableHead className="w-[60px] sm:w-[72px]" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categories.slice((categoryPage - 1) * PAGE_SIZE, categoryPage * PAGE_SIZE).map((c) => (
                        <TableRow key={c.id} className="group">
                          <TableCell dir="rtl" className="py-4 px-4 sm:px-6 align-middle">
                            {c.name}
                          </TableCell>
                          <TableCell className="py-2 px-4 sm:px-6">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="ghost" className="h-9 w-9 p-0" aria-label={t('common.view')}>
                                  <MoreVertical className="h-4 w-4" aria-hidden />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start" className="min-w-[140px]">
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
                    {categories.length > PAGE_SIZE && (
                      <div className="flex items-center justify-between border-t border-border px-4 sm:px-6 py-3 text-sm bg-muted/30">
                        <span className="text-muted-foreground">{t('common.page')} {categoryPage} {t('common.of')} {categoryTotalPages} ({categories.length})</span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" disabled={categoryPage <= 1} onClick={() => setCategoryPage((p) => Math.max(1, p - 1))}>
                            <ChevronLeft className="h-4 w-4" aria-hidden />
                          </Button>
                          <Button size="sm" variant="outline" disabled={categoryPage >= categoryTotalPages} onClick={() => setCategoryPage((p) => p + 1)}>
                            <ChevronRight className="h-4 w-4" aria-hidden />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
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
              {viewItem?.type === 'author' ? t('settings.authorName') : viewItem?.type === 'category' ? t('settings.categoryName') : t('settings.nashirName')}
            </DialogTitle>
          </DialogHeader>
          {viewItem && (
            <div className="space-y-2 py-2">
              <p className="text-foreground font-medium" dir="rtl">{viewItem.name}</p>
              <p className="text-muted-foreground text-xs font-mono">{viewItem.id}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
