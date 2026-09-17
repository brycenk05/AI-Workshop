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
          <h2>This semester</h2>
          <ul className="list">
            <li>Coursework: SLS 480E</li>
            <li>AIR project: something to do with trading cards</li>
            <li>
              Looking to build his skills and knowledge within real-world
              applications
            </li>
          </ul>
        </section>

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
      </main>

      <footer className="footer">
        <p>
          Brycen Kano &middot; {year}
        </p>
        <p>Built with Claude Code</p>
      </footer>
    </div>
  );
}
