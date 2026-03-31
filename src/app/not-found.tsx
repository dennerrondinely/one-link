import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page">
      <section className="card">
        <h1>404</h1>
        <p>Pagina nao encontrada.</p>
        <Link href="/" className="link">
          Voltar para inicio
        </Link>
      </section>
    </main>
  );
}