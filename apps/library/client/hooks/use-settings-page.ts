import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useModal } from '@arabiaaislamia/ui';
import { useBookAuthors, useBookAuthorsCreate, useBookAuthorsUpdate, useBookAuthorsDelete } from './use-book-authors';
import { useBookCategories, useBookCategoriesCreate, useBookCategoriesUpdate, useBookCategoriesDelete } from './use-book-categories';
import { useBookNashirs, useBookNashirsCreate, useBookNashirsUpdate, useBookNashirsDelete } from './use-book-nashirs';
import { useAuthMe } from './use-auth';
import type { Author, Category, Nashir } from '@/types';

const PAGE_SIZE = 10;

export function useSettingsPage(t: (k: string) => string) {
  const router = useRouter();
  const modal = useModal();
  const [activeTab, setActiveTab] = useState<'authors' | 'categories' | 'nashirs'>('authors');
  const [authorPage, setAuthorPage] = useState(1);
  const [categoryPage, setCategoryPage] = useState(1);
  const [nashirPage, setNashirPage] = useState(1);
  const [viewItem, setViewItem] = useState<{ type: 'author' | 'category' | 'nashir'; name: string; id: string } | null>(null);
  const [editItem, setEditItem] = useState<{ type: 'author' | 'category' | 'nashir'; name: string; id: string } | null>(null);

  const meQuery = useAuthMe();
  const authorsQuery = useBookAuthors();
  const categoriesQuery = useBookCategories();
  const nashirsQuery = useBookNashirs();
  const createAuthor = useBookAuthorsCreate();
  const updateAuthor = useBookAuthorsUpdate();
  const createCategory = useBookCategoriesCreate();
  const updateCategory = useBookCategoriesUpdate();
  const createNashir = useBookNashirsCreate();
  const updateNashir = useBookNashirsUpdate();
  const deleteAuthor = useBookAuthorsDelete();
  const deleteCategory = useBookCategoriesDelete();
  const deleteNashir = useBookNashirsDelete();

  const isSuperAdmin = meQuery.data?.data?.user?.isSuperAdmin ?? false;

  useEffect(() => {
    if (meQuery.isSuccess && !isSuperAdmin && typeof window !== 'undefined') {
      router.replace('/');
    }
  }, [meQuery.isSuccess, isSuperAdmin, router]);

  const authors = authorsQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];
  const nashirs = nashirsQuery.data ?? [];

  const authorTotalPages = Math.max(1, Math.ceil(authors.length / PAGE_SIZE));
  const categoryTotalPages = Math.max(1, Math.ceil(categories.length / PAGE_SIZE));
  const nashirTotalPages = Math.max(1, Math.ceil(nashirs.length / PAGE_SIZE));

  const deleteAuthorConfirm = useCallback(
    (author: Author) => {
      modal.confirmation({
        title: t('books.delete'),
        description: `${t('settings.authorName')}: ${author.name}`,
        confirmText: t('common.confirm'),
        cancelText: t('common.cancel'),
        variant: 'destructive',
        onConfirm: () => deleteAuthor.mutateAsync(author.id),
      });
    },
    [modal, deleteAuthor, t]
  );

  const deleteCategoryConfirm = useCallback(
    (category: Category) => {
      modal.confirmation({
        title: t('books.delete'),
        description: `${t('settings.categoryName')}: ${category.name}`,
        confirmText: t('common.confirm'),
        cancelText: t('common.cancel'),
        variant: 'destructive',
        onConfirm: () => deleteCategory.mutateAsync(category.id),
      });
    },
    [modal, deleteCategory, t]
  );

  const openEditItem = useCallback((item: { type: 'author' | 'category' | 'nashir'; name: string; id: string }) => setEditItem(item), []);
  const closeEditItem = useCallback(() => setEditItem(null), []);

  const handleEditItemSave = useCallback(
    async (id: string, name: string) => {
      if (!editItem) return;
      if (editItem.type === 'author') await updateAuthor.mutateAsync({ id, name });
      else if (editItem.type === 'category') await updateCategory.mutateAsync({ id, name });
      else await updateNashir.mutateAsync({ id, name });
      closeEditItem();
    },
    [editItem, updateAuthor, updateCategory, updateNashir, closeEditItem]
  );

  const deleteNashirConfirm = useCallback(
    (nashir: Nashir) => {
      modal.confirmation({
        title: t('books.delete'),
        description: `${t('settings.nashirName')}: ${nashir.name}`,
        confirmText: t('common.confirm'),
        cancelText: t('common.cancel'),
        variant: 'destructive',
        onConfirm: () => deleteNashir.mutateAsync(nashir.id),
      });
    },
    [modal, deleteNashir, t]
  );

  return {
    activeTab,
    setActiveTab,
    authors,
    categories,
    nashirs,
    authorPage,
    setAuthorPage,
    categoryPage,
    setCategoryPage,
    nashirPage,
    setNashirPage,
    authorTotalPages,
    categoryTotalPages,
    nashirTotalPages,
    viewItem,
    setViewItem,
    editItem,
    openEditItem,
    closeEditItem,
    handleEditItemSave,
    createAuthor,
    createCategory,
    createNashir,
    deleteAuthorConfirm,
    deleteCategoryConfirm,
    deleteNashirConfirm,
    isSuperAdmin,
    ready: meQuery.isSuccess,
    t,
  };
}
