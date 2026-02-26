'use client';

import { motion } from 'framer-motion';
import { Button, Card } from '@arabiaaislamia/ui';
import { defaultTransition, fadeInUp, staggerContainer } from '@arabiaaislamia/animations';
import { useLocale } from '@/lib/locale';
import { useBooksPage } from '@/hooks/use-books-page';
import { PageHeader, PageSkeleton, Pagination } from '@/components/common';
import { BooksFilter, BooksTable, AddBookModal, EditBookModal, BookDetailModal, PrintChitsModal } from '@/components/books';
import { Plus } from 'lucide-react';

export default function BooksPage() {
  const { t } = useLocale();
  const {
    page,
    setPage,
    filters,
    setFilters,
    filterKeys,
    books,
    total,
    totalPages,
    loading,
    authors,
    categories,
    nashirs,
    createBook,
    createAuthor,
    createCategory,
    createNashir,
    addBookOpen,
    openAddBook,
    closeAddBook,
    editBook,
    openEditBook,
    closeEditBook,
    viewBook,
    openViewBook,
    closeViewBook,
    openDeleteConfirm,
    openPrintModal,
    printModalOpen,
    setPrintModalOpen,
    printCategory,
    setPrintCategory,
    printShelfNumber,
    setPrintShelfNumber,
    printLoading,
    handlePrintAll,
    applyFilters,
    handleAddBookSuccess,
    updateBook,
    handleEditBookSuccess,
  } = useBooksPage(t);

  if (loading && books.length === 0) {
    return (
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" transition={defaultTransition}>
        <PageSkeleton filterFields={12} tableRows={8} />
      </motion.div>
    );
  }

  return (
    <motion.div className="space-y-8" variants={staggerContainer} initial="hidden" animate="visible" transition={defaultTransition}>
      <motion.div variants={fadeInUp}>
        <PageHeader title={t('books.title')} action={<Button onClick={openAddBook} className="gap-2 shrink-0 shadow-sm bg-primary text-primary-foreground hover:opacity-90"><Plus className="h-4 w-4" aria-hidden />{t('books.addBook')}</Button>} />
      </motion.div>
      <motion.div variants={fadeInUp}>
        <BooksFilter filterKeys={filterKeys} filters={filters} onFilterChange={(k, v) => setFilters((f) => ({ ...f, [k]: v }))} onApply={applyFilters} onPrintAll={openPrintModal} t={t} />
      </motion.div>
      <motion.div variants={fadeInUp}>
        <Card className="overflow-hidden">
          <BooksTable books={books} onView={openViewBook} onEdit={openEditBook} onDelete={openDeleteConfirm} t={t} />
          <Pagination page={page} totalPages={totalPages} total={total} onPrev={() => setPage((p) => Math.max(1, p - 1))} onNext={() => setPage((p) => Math.min(totalPages, p + 1))} pageLabel={t('common.page')} ofLabel={t('common.of')} />
        </Card>
      </motion.div>
      <AddBookModal open={addBookOpen} onClose={closeAddBook} authors={authors} categories={categories} nashirs={nashirs} onCreateBook={(d) => createBook.mutateAsync(d as Parameters<typeof createBook.mutateAsync>[0])} onCreateAuthor={(n) => createAuthor.mutateAsync(n)} onCreateCategory={(n) => createCategory.mutateAsync(n)} onCreateNashir={(n) => createNashir.mutateAsync(n)} onSuccess={handleAddBookSuccess} t={t} />
      <EditBookModal open={!!editBook} book={editBook} onClose={closeEditBook} authors={authors} categories={categories} nashirs={nashirs} onUpdate={(id, d) => updateBook.mutateAsync({ id, data: d })} onSuccess={handleEditBookSuccess} t={t} />
      <BookDetailModal book={viewBook} onClose={closeViewBook} t={t} />
      <PrintChitsModal open={printModalOpen} onClose={() => setPrintModalOpen(false)} category={printCategory} onCategoryChange={(v) => setPrintCategory(v as 'shelf' | '')} shelfNumber={printShelfNumber} onShelfNumberChange={setPrintShelfNumber} loading={printLoading} onPrint={handlePrintAll} t={t} />
    </motion.div>
  );
}
