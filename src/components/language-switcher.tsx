"use client";

import { Button } from "./ui/button";
import { usePathname, useRouter } from 'next/navigation'

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (lang: string) => {
    router.push(`/${lang}${pathname}`);
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => switchLanguage("en")}
      >
        EN
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => switchLanguage("km")}
      >
        ខ្មែរ
      </Button>
    </div>

  );
}