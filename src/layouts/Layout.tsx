import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import ToastProvider from '../components/ToastProvider';
import AnnouncementPopup from '../components/AnnouncementPopup';
import QuickInquiry from '../components/QuickInquiry';

export default function Layout() {
  return (
    <>
      <ToastProvider />
      <AnnouncementPopup />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
      <QuickInquiry />
    </>
  );
}
