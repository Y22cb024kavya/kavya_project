import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Programs from "@/pages/Programs";
import ProgramSyllabus from "@/pages/ProgramSyllabus";
import Institutions from "@/pages/Institutions";
import Reviews from "@/pages/Reviews";
import Contact from "@/pages/Contact";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminReviews from "@/pages/AdminReviews";

const withLayout = (Page) => (
  <Layout>
    <Page />
  </Layout>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={withLayout(Home)} />
        <Route path="/about" element={withLayout(About)} />
        <Route path="/programs" element={withLayout(Programs)} />
        <Route path="/programs/:slug" element={withLayout(ProgramSyllabus)} />
        <Route path="/institutions" element={withLayout(Institutions)} />
        <Route path="/reviews" element={withLayout(Reviews)} />
        <Route path="/contact" element={withLayout(Contact)} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/reviews" element={<AdminReviews />} />
      </Routes>
      <Toaster position="top-center" />
    </BrowserRouter>
  );
}

export default App;
