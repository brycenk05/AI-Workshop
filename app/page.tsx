export default function Home() {
  const year = new Date().getFullYear();

  return (
    <div className="page">
      <header className="hero">
        <h1>Brycen Kano</h1>
        <p className="tagline">a senior at UH Manoa studying computer science.</p>
      </header>

      <main>
        <section className="section">
          <h2>About</h2>
          <p>
            Brycen is a senior at the University of Hawai&apos;i at Manoa, studying
            computer science. He focuses on software development and enjoys
            digging into how systems work under the hood. Outside of
            coursework, he likes building things with code, from small
            personal tools to larger side projects.
          </p>
        </section>

        <section className="section">
          <h2>This semester</h2>
          <ul className="list">
            <li>
              Placeholder: coursework — e.g. a systems or software engineering
              class. (Brycen: replace with your actual classes.)
            </li>
            <li>
              Placeholder: a personal or class project he&apos;s building. (Brycen:
              replace with what you&apos;re actually working on.)
            </li>
            <li>
              Placeholder: searching for a software engineering internship or
              new-grad role. (Brycen: replace with your actual job search
              status.)
            </li>
          </ul>
        </section>
      </main>

      <footer className="footer">
        <p>
          Brycen Kano &middot; {year}
        </p>
      </footer>
    </div>
  );
}
