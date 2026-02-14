'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@arabiaaislamia/ui';
import { fadeInUp, staggerContainer, defaultTransition } from '@arabiaaislamia/animations';
import { useLocale } from '@/lib/locale';
import { BookPlus, BookCheck, ArrowLeft } from 'lucide-react';

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
      className="max-w-3xl space-y-8"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      transition={defaultTransition}
    >
      <motion.div variants={fadeInUp} className='flex flex-col gap-4'>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">{welcome}</h1>
        <p className="text-muted-foreground">{t('dashboard.subtitle')}</p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2">
        <motion.div variants={fadeInUp}>
          <Card className="h-full overflow-hidden border-2 border-transparent hover:border-primary hover:shadow-lg transition-all duration-300 group">
            <CardHeader className="bg-primary/10 border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary/20 p-3 group-hover:bg-primary/30 transition-colors">
                  <BookPlus className="h-8 w-8 text-primary" aria-hidden />
                </div>
                <CardTitle className="text-lg">{addBooksTitle}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-5 flex flex-col gap-4">
              <p className="text-muted-foreground text-sm leading-relaxed">{addBooksDesc}</p>
              <Link href="/books" className="mt-auto">
                <Button className="w-full gap-2 group/btn">
                  {addBooksAction}
                  <ArrowLeft className="h-4 w-4 group-hover/btn:-translate-x-0.5 transition-transform" aria-hidden />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="h-full overflow-hidden border-2 border-transparent hover:border-primary hover:shadow-lg transition-all duration-300 group">
            <CardHeader className="bg-primary/10 border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary/20 p-3 group-hover:bg-primary/30 transition-colors">
                  <BookCheck className="h-8 w-8 text-primary" aria-hidden />
                </div>
                <CardTitle className="text-lg">{issueBookTitle}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-5 flex flex-col gap-4">
              <p className="text-muted-foreground text-sm leading-relaxed">{issueBookDesc}</p>
              <Link href="/issues" className="mt-auto">
                <Button className="w-full gap-2 group/btn">
                  {issueBookAction}
                  <ArrowLeft className="h-4 w-4 group-hover/btn:-translate-x-0.5 transition-transform" aria-hidden />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
