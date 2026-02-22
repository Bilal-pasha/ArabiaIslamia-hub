'use client';

import { motion } from 'framer-motion';
import { Button, Card } from '@arabiaaislamia/ui';
import { defaultTransition, fadeInUp, staggerContainer } from '@arabiaaislamia/animations';
import { useLocale } from '@/lib/locale';
import { useIssuesPage } from '@/hooks/use-issues-page';
import { PageHeader, PageSkeleton, Pagination } from '@/components/common';
import { IssuesFilter, IssuesTable } from '@/components/issues';
import { Plus } from 'lucide-react';

export default function IssuesPage() {
  const { t } = useLocale();
  const {
    page,
    setPage,
    filters,
    setFilter,
    issues,
    books,
    total,
    totalPages,
    loading,
    openIssueBookModal,
    openViewModal,
    openDeleteConfirm,
    handleReturn,
    applyFilters,
  } = useIssuesPage(t);

  if (loading && issues.length === 0) {
    return (
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" transition={defaultTransition}>
        <PageSkeleton filterFields={12} tableRows={8} />
      </motion.div>
    );
  }

  return (
    <motion.div className="space-y-8" variants={staggerContainer} initial="hidden" animate="visible" transition={defaultTransition}>
      <motion.div variants={fadeInUp}>
        <PageHeader
          title={t('issues.title')}
          action={
            <Button onClick={openIssueBookModal} className="gap-2 shrink-0 shadow-sm bg-primary text-primary-foreground hover:opacity-90 opacity-100">
              <Plus className="h-4 w-4" aria-hidden />
              {t('issues.issueBook')}
            </Button>
          }
        />
      </motion.div>
      <motion.div variants={fadeInUp}>
        <IssuesFilter filters={filters} onFilterChange={setFilter} books={books} onApply={applyFilters} t={t} />
      </motion.div>
      <motion.div variants={fadeInUp}>
        <Card className="overflow-hidden">
          <div className="rounded-lg border border-border overflow-hidden">
            <IssuesTable issues={issues} onView={openViewModal} onReturn={handleReturn} onDelete={openDeleteConfirm} t={t} />
          </div>
          <Pagination page={page} totalPages={totalPages} total={total} onPrev={() => setPage((p) => Math.max(1, p - 1))} onNext={() => setPage((p) => Math.min(totalPages, p + 1))} pageLabel={t('common.page')} ofLabel={t('common.of')} />
        </Card>
      </motion.div>
    </motion.div>
  );
}
