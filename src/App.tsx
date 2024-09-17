import React from 'react';
import DynamicInput from './components/DynamicInput';

function App() {
  return (
    <div className="App min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
        Dynamic Input with Tags
      </h1>
      <DynamicInput />
    </div>
  );
}

export default App;
