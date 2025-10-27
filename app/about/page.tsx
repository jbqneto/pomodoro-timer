// app/about/page.tsx
import MainTemplate from "@/components/templates/main";
import { Metadata } from "next";
import { Main } from "next/document";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Saiba mais sobre a técnica Pomodoro e o uso de música (Lo-fi, clássica, gregoriano) para concentração.",
};

export default function AboutPage() {
  return (
    <MainTemplate>
    <section className="mx-auto max-w-3xl px-4 py-10 prose prose-invert">
      <header className="mb-10">
        <h1>Porque do Projeto</h1>
        <p>
          Este projeto nasceu da junção de disciplina temporal com harmonia sonora. A ideia é oferecer um espaço digital onde o foco e a serenidade coexistem, usando ciclos estruturados e música como apoio.
        </p>
      </header>

      <section className="mb-10">
        <h1>Sobre o Pomodoro</h1>
        <p>
          A Técnica Pomodoro foi criada por Francesco Cirillo nos anos 1980. Ela utiliza blocos de 25 minutos de trabalho seguidos por pausas curtas para ajudar a manter o foco, reduzir fadiga mental e tornar grandes tarefas mais gerenciáveis.
        </p>
      </section>

      <section>
        <h1>Músicas para Concentração</h1>
        <br />
        <article className="mb-8">
          <h2>Lo-fi</h2>
          <p>
            O lo-fi (low fidelity) inclui imperfeições sonoras sutis — ruídos de fundo, hiss, gravações analógicas — que compõem uma textura sonora relaxante. Pesquisas apontam que o lo-fi melhora a concentração ao mascarar ruídos externos e proporcionar um fundo auditivo constante e discreto.
          </p>
        </article>

        <article className="mb-8">
          <h2>Clássica</h2>
          <p>
            A música clássica instrumental é amplamente usada em ambientes de estudo. Por ser livre de letras, ela evita distrações auditivas e suas harmonias regulares ajudam a promover um estado de tranquilidade mental, ideal para tarefas cognitivas.
          </p>
        </article>

        <article>
          <h2>Gregoriano</h2>
          <p>
            Os cantos gregorianos são canções litúrgicas monofônicas frequentemente utilizadas em práticas contemplativas. Sua repetitividade e harmonia estável podem favorecer uma experiência de foco sereno, especialmente para quem se identifica com esse estilo musical espiritual.
          </p>
        </article>
      </section>
    </section>
    </MainTemplate>
  );
}
