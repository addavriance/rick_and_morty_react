import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Characters from './pages/Characters/Characters';
import Character from './pages/Character/Character';
import Locations from './pages/Locations/Locations';
import Location from './pages/Location/Location';
import Episodes from './pages/Episodes/Episodes';
import Episode from './pages/Episode/Episode';
import './styles/base.css';

function App() {
  return (
      <AppProvider>
        <Router>
          <div className="App">
            <Header />
            <main className="main">
              <div className="container main__container">
                <Routes>
                  <Route path="/" element={<Characters />} />
                  <Route path="/characters" element={<Characters />} />
                  <Route path="/character/:id" element={<Character />} />
                  <Route path="/locations" element={<Locations />} />
                  <Route path="/location/:id" element={<Location />} />
                  <Route path="/episodes" element={<Episodes />} />
                  <Route path="/episode/:id" element={<Episode />} />
                </Routes>
              </div>
            </main>
            <Footer />
          </div>
        </Router>
      </AppProvider>
  );
}

export default App;
