import Sidebar from "../sidebar/Sidebar";
import Footer from "../footer/Footer";
import Header from "../header/Header";

function Main({ children }) {
  return (
    <div className="scroll-smooth ">
      <div className="relative w-full border-b shadow-md">
        <Header />
        <Sidebar />
      </div>

      <div className="border-none">{children}</div>
      <Footer />
    </div>
  );
}

export default Main;
