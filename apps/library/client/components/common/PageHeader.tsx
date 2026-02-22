import { Button } from '@arabiaaislamia/ui';

type PageHeaderProps = {
  title: string;
  action?: React.ReactNode;
};

export function PageHeader({ title, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      {action}
    </div>
  );
}
