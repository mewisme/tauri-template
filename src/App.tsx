import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Home } from './pages/home';
import { Layout } from './components/layout';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Toaster position="bottom-right" richColors />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}