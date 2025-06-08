
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';


const Layout = ({ children }) => {
  const { pathname } = useLocation();
  const hideLayoutPaths = ['/login', '/register'];

  // Hide layout on auth pages
  if (hideLayoutPaths.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
