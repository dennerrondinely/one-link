import Link from "next/link";
import { RedirectClient } from "@/components/redirect-client";
import { getDeviceInfo } from "@/lib/device";
import { links } from "@/lib/links";
import { headers } from "next/headers";

interface DynamicPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DynamicRedirectPage({ params }: DynamicPageProps) {
  const { id } = await params;
  const link = links[id];

  if (!link) {
    return (
      <main className="page">
        <section className="card">
          <h1>Link nao encontrado</h1>
          <p>
            O link <code>{id}</code> nao existe.
          </p>
          <Link href="/" className="link">
            Voltar para inicio
          </Link>
        </section>
      </main>
    );
  }

  const headerList = await headers();
  const userAgent = headerList.get("user-agent") ?? "";
  const device = getDeviceInfo(userAgent);

  const storeUrl = device.isiOS ? link.appStore : link.playStore;

  console.log(
    `[${new Date().toISOString()}] ${id} - ${device.isMobile ? "Mobile" : "Desktop"} - ${device.platform}`
  );

  return (
    <main className="page redirect-page">
      <section className="card redirect-card">
        <RedirectClient appUrl={link.appUrl} storeUrl={storeUrl} />
      </section>
    </main>
  );
}