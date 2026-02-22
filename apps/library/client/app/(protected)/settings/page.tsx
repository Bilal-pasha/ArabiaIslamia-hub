'use client';

import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, defaultTransition } from '@arabiaaislamia/animations';
import { useLocale } from '@/lib/locale';
import { useSettingsPage } from '@/hooks/use-settings-page';
import { PageHeader, PageSkeleton } from '@/components/common';
import { SettingsTabs, SettingsEntityTab, ViewItemDialog, BackupButton } from '@/components/settings';

export default function SettingsPage() {
  const { t } = useLocale();
  const {
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
    createAuthor,
    createCategory,
    createNashir,
    deleteAuthorConfirm,
    deleteCategoryConfirm,
    deleteNashirConfirm,
    ready,
  } = useSettingsPage(t);

  if (!ready) {
    return (
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" transition={defaultTransition}>
        <PageSkeleton filterFields={4} tableRows={6} />
      </motion.div>
    );
  }

  return (
    <motion.div className="space-y-8" variants={staggerContainer} initial="hidden" animate="visible" transition={defaultTransition}>
      <motion.div variants={fadeInUp}>
        <PageHeader title={t('settings.title')} action={<BackupButton t={t} />} />
      </motion.div>
      <motion.div variants={fadeInUp}>
        <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} t={t} />
      </motion.div>
      {activeTab === 'authors' && (
        <motion.div variants={fadeInUp}>
          <SettingsEntityTab
            items={authors}
            page={authorPage}
            totalPages={authorTotalPages}
            onPageChange={setAuthorPage}
            createMutation={createAuthor}
            onDelete={deleteAuthorConfirm}
            onView={(a) => setViewItem({ type: 'author', name: a.name, id: a.id })}
            labelKey="settings.authorName"
            placeholderKey="settings.addAuthor"
            emptyKey="settings.emptyAuthors"
            pageSize={10}
            t={t}
          />
        </motion.div>
      )}
      {activeTab === 'categories' && (
        <motion.div variants={fadeInUp}>
          <SettingsEntityTab
            items={categories}
            page={categoryPage}
            totalPages={categoryTotalPages}
            onPageChange={setCategoryPage}
            createMutation={createCategory}
            onDelete={deleteCategoryConfirm}
            onView={(c) => setViewItem({ type: 'category', name: c.name, id: c.id })}
            labelKey="settings.categoryName"
            placeholderKey="settings.addCategory"
            emptyKey="settings.emptyCategories"
            pageSize={10}
            t={t}
          />
        </motion.div>
      )}
      {activeTab === 'nashirs' && (
        <motion.div variants={fadeInUp}>
          <SettingsEntityTab
            items={nashirs}
            page={nashirPage}
            totalPages={nashirTotalPages}
            onPageChange={setNashirPage}
            createMutation={createNashir}
            onDelete={deleteNashirConfirm}
            onView={(n) => setViewItem({ type: 'nashir', name: n.name, id: n.id })}
            labelKey="settings.nashirName"
            placeholderKey="settings.addNashir"
            emptyKey="settings.emptyNashirs"
            pageSize={10}
            t={t}
          />
        </motion.div>
      )}
      <ViewItemDialog viewItem={viewItem} onClose={() => setViewItem(null)} t={t} />
    </motion.div>
  );
}
