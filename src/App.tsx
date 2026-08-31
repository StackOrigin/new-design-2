import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Layout from './layouts/Layout';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Admissions = lazy(() => import('./pages/Admissions'));
const Academics = lazy(() => import('./pages/Academics'));
const Facilities = lazy(() => import('./pages/Facilities'));
const News = lazy(() => import('./pages/News'));
const NewsDetail = lazy(() => import('./pages/NewsDetail'));
const Events = lazy(() => import('./pages/Events'));
const Achievements = lazy(() => import('./pages/Achievements'));
const Downloads = lazy(() => import('./pages/Downloads'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Contact = lazy(() => import('./pages/Contact'));
const Notices = lazy(() => import('./pages/Notices'));
const Testimonials = lazy(() => import('./pages/Testimonials'));
const NotFound = lazy(() => import('./pages/NotFound'));

const PageLoader = () => (
  <div className="loading-page">
    <div className="loader"></div>
    <p>Loading...</p>
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/admissions" element={<Admissions />} />
            <Route path="/academics" element={<Academics />} />
            <Route path="/facilities" element={<Facilities />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/events" element={<Events />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/downloads" element={<Downloads />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/notices" element={<Notices />} />
            <Route path="/testimonials" element={<Testimonials />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;

