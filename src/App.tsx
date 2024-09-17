import React from 'react';
import DynamicInput from './components/DynamicInput';

function App() {
  return (
    <div className="App min-h-screen bg-gray-900 p-8">
      <h1 className="text-4xl font-bold text-center text-gray-100 mb-8">
        Bubble Dynamic Input
      </h1>
      <DynamicInput />
    </div>
  );
}

export default App;
