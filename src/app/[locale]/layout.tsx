import { Provider } from "@/src/providers";
import enMessages from "@/src/message/en.json";
import kmMessages from "@/src/message/km.json";

const messagesMap = { en: enMessages, km: kmMessages };

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = messagesMap[locale as keyof typeof messagesMap];

  return <Provider locale={locale} messages={messages}>{children}</Provider>;
}
