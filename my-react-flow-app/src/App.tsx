// App.tsx

import React from "react";
import Section from "./components/Section";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <header className="bg-blue-600 w-full p-4 text-white text-center text-2xl font-bold">
        Welcome to the App
      </header>
      <main className="flex-1 w-full max-w-5xl p-4">
        <Section />
      </main>
      <footer className="bg-gray-800 w-full p-4 text-white text-center">
        © {new Date().getFullYear()} Your Company Name
      </footer>
    </div>
  );
};

export default App;
