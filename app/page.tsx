import AuthStatus from "./components/AuthStatus";
import TaskList from "./components/TaskList";

export default function Home() {
  return (
    <div className="page">
      <header className="hero">
        <h1>Task list</h1>
        <p className="tagline">One place to keep your to-dos.</p>
      </header>

      <AuthStatus />
      <TaskList />

      <footer className="footer">
        <p>Built with Claude Code</p>
      </footer>
    </div>
  );
}
