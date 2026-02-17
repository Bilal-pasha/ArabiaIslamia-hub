'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@arabiaaislamia/ui';
import { fadeInUp, staggerContainer, defaultTransition } from '@arabiaaislamia/animations';
import { useLocale } from '@/lib/locale';
import { MainLogo } from '@/components/main-logo';
import { BookPlus, BookCheck, ArrowRight, Library } from 'lucide-react';

export default function DashboardPage() {
  const { t } = useLocale();
  const welcome = t('dashboard.welcome');
  const addBooksTitle = t('dashboard.addBooksTitle');
  const addBooksDesc = t('dashboard.addBooksDesc');
  const addBooksAction = t('dashboard.addBooksAction');
  const issueBookTitle = t('dashboard.issueBookTitle');
  const issueBookDesc = t('dashboard.issueBookDesc');
  const issueBookAction = t('dashboard.issueBookAction');

  return (
    <motion.div
      className="max-w-4xl space-y-10"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      transition={defaultTransition}
    >
      {/* Hero / welcome */}
      <motion.div
        variants={fadeInUp}
        className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-primary/8 via-card to-secondary/5 p-6 shadow-lg shadow-primary/5 md:p-8"
      >
        <div className="absolute end-4 top-4 opacity-10">
          <Library className="h-24 w-24 text-primary" aria-hidden />
        </div>
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-primary/20 bg-card shadow-md">
              <MainLogo width={44} height={44} className="rounded-lg object-contain" />
            </div>
            <div className='flex flex-col gap-4'>
              <h1 className="text-2xl font-bold text-foreground">{welcome}</h1>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action cards */}
      <div className="grid gap-6 sm:grid-cols-2">
        <motion.div variants={fadeInUp}>
          <Link href="/books" className="block h-full">
            <motion.div
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.99 }}
              className="h-full"
            >
              <Card className="h-full overflow-hidden border-2 border-transparent bg-card shadow-md transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 group">
                <CardHeader className="border-b border-border bg-gradient-to-r from-primary/10 to-primary/5 pb-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/20 shadow-inner transition-colors group-hover:bg-primary/30">
                      <BookPlus className="h-6 w-6 text-primary" aria-hidden />
                    </div>
                    <CardTitle className="text-lg font-semibold">{addBooksTitle}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 pt-5">
                  <p className="text-muted-foreground text-sm leading-relaxed">{addBooksDesc}</p>
                  <Button className="w-full gap-2 font-medium shadow-sm group/btn">
                    {addBooksAction}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" aria-hidden />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Link>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Link href="/issues" className="block h-full">
            <motion.div
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.99 }}
              className="h-full"
            >
              <Card className="h-full overflow-hidden border-2 border-transparent bg-card shadow-md transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 group">
                <CardHeader className="border-b border-border bg-gradient-to-r from-primary/10 to-primary/5 pb-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/20 shadow-inner transition-colors group-hover:bg-primary/30">
                      <BookCheck className="h-6 w-6 text-primary" aria-hidden />
                    </div>
                    <CardTitle className="text-lg font-semibold">{issueBookTitle}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 pt-5">
                  <p className="text-muted-foreground text-sm leading-relaxed">{issueBookDesc}</p>
                  <Button className="w-full gap-2 font-medium shadow-sm group/btn">
                    {issueBookAction}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" aria-hidden />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
