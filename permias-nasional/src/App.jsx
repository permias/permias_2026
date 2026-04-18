import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout.jsx';
import { Home } from './pages/Home.jsx';
import { Chapters } from './pages/Chapters.jsx';
import { ResourcesIndex } from './pages/ResourcesIndex.jsx';
import { ResourceTopic } from './pages/ResourceTopic.jsx';
import { Events } from './pages/Events.jsx';
import { Team } from './pages/Team.jsx';
import { About } from './pages/About.jsx';
import { Contact } from './pages/Contact.jsx';
import { Partners } from './pages/Partners.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/chapters" element={<Chapters />} />
          <Route path="/about/chapters" element={<Chapters />} />
          <Route path="/resources" element={<ResourcesIndex />} />
          <Route path="/resources/:topicId" element={<ResourceTopic />} />
          <Route path="/events" element={<Events />} />
          <Route path="/team" element={<Team />} />
          <Route path="/about/team" element={<Team />} />
          <Route path="/about" element={<About />} />
          <Route path="/about/sejarah" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/partners" element={<Partners />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
