import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import List from './List.jsx';
import Register from './Register.jsx';
import Edit from './Edit.jsx';

function App() {
  return (
    <Router>
      <header>
        <nav>
          <ul>
            <Link to="/">Register</Link>
            <Link to="/list">List</Link>
          </ul>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/list" element={<List />} />
          <Route path="/edit/:id" element={<Edit />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
