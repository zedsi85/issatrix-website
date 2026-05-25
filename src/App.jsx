import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './components/marketing/Nav.jsx';
import Hero from './components/marketing/Hero.jsx';
import MatrixExplainer from './components/marketing/MatrixExplainer.jsx';
import Pillars from './components/marketing/Pillars.jsx';
import BothSides from './components/marketing/BothSides.jsx';
import Stats from './components/marketing/Stats.jsx';
import CaseStudy from './components/marketing/CaseStudy.jsx';
import AssetStructuringTool from './components/marketing/AssetStructuringTool.jsx';
import Footer from './components/marketing/Footer.jsx';
import IssuancePage from './pages/IssuancePage.jsx';
import CompliancePage from './pages/CompliancePage.jsx';
import DocsPage from './pages/DocsPage.jsx';
import AquaIndexPage from './pages/use-cases/AquaIndexPage.jsx';
import SabrexPage from './pages/use-cases/SabrexPage.jsx';
import HearstocksPage from './pages/use-cases/HearstocksPage.jsx';

// Admin
import AdminLayout from './pages/admin/AdminLayout.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AgentChat from './pages/admin/AgentChat.jsx';
import ProjectList from './pages/admin/ProjectList.jsx';
import BriefViewer from './pages/admin/BriefViewer.jsx';

function MarketingHome() {
  return (
    <main>
      <Hero cellSize={36} density={16} intensity={0} />
      <MatrixExplainer />
      <Pillars />
      <BothSides />
      <Stats />
      <CaseStudy />
      <AssetStructuringTool />
    </main>
  );
}

function MarketingApp() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<MarketingHome />} />
        <Route path="/issuance" element={<IssuancePage />} />
        <Route path="/compliance" element={<CompliancePage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/use-cases/aquaindex" element={<AquaIndexPage />} />
        <Route path="/use-cases/sabrex" element={<SabrexPage />} />
        <Route path="/use-cases/hearstocks" element={<HearstocksPage />} />
        <Route path="*" element={<MarketingHome />} />
      </Routes>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin — no Nav/Footer */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="agent/:sessionId" element={<AgentChat />} />
          <Route path="projects" element={<ProjectList />} />
          <Route path="projects/:projectId" element={<BriefViewer />} />
        </Route>

        {/* Marketing */}
        <Route path="/*" element={<MarketingApp />} />
      </Routes>
    </BrowserRouter>
  );
}
