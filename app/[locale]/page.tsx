import { Button } from "@/components/ui/button";

import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations();
  return (
    <div className="p-4">
      <div className="flex gap-4">
        <Button variant="outline">{t('auth.signIn')}</Button>
      </div>
    </div>
  );
}
