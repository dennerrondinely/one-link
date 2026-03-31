import { headers } from "next/headers";
import Link from "next/link";
import { getDeviceInfo } from "@/lib/device";
import { links } from "@/lib/links";

export default async function HomePage() {
  const headerList = await headers();
  const userAgent = headerList.get("user-agent") ?? "";
  const device = getDeviceInfo(userAgent);

  return (
    <main className="page home-page">
      <section className="card">
        <h1>OneLink Next</h1>
        <p>Redirecionamento inteligente para mobile e desktop.</p>

        <div className="info-box">
          <h2>Seu dispositivo</h2>
          <p>Mobile: {device.isMobile ? "Sim" : "Nao"}</p>
          <p>Desktop: {device.isDesktop ? "Sim" : "Nao"}</p>
          <p>Platform: {device.platform}</p>
          <p>Browser: {device.browser}</p>
        </div>

        <h2>Links de teste</h2>
        <ul className="link-list">
          {Object.entries(links).map(([id, item]) => (
            <li key={id}>
              <Link href={`/${id}`} className="link">
                /{id}
              </Link>{" "}
              - {item.name}
            </li>
          ))}
        </ul>

        <p>
          Acesse <code>/&lt;link-id&gt;</code> para testar o redirecionamento.
        </p>
      </section>
    </main>
  );
}