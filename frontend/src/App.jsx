import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { VideoChat } from './pages/VideoChat';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<VideoChat />} />
      </Routes>
    </Router>
  );
}

export default App;
