import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { VideoChat } from './pages/VideoChat';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VideoChat />} />
        {/* We will add swipe features and profiles here later */}
      </Routes>
    </Router>
  );
}

export default App;
