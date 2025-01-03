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
            <li><Link to="/">Register</Link></li>
            <li><Link to="/list">List</Link></li>
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
