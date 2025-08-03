import React from 'react';
import Routes from './Routes';
import AIFallbackManager from './components/ui/AIFallbackManager';

function App() {
  return (
    <>
      <Routes />
      <AIFallbackManager />
    </>
  );
}

export default App;