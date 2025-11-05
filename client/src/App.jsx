import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Posts from './pages/Posts';
import Login from './components/Login';

const App = () => {
  // Initialize theme on mount
  useEffect(() => {
    // Default to dark mode if no preference is set
    if (!localStorage.theme) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else if (localStorage.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    localStorage.theme = document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light';
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-zinc-900">
        <header className="bg-white dark:bg-zinc-800 shadow w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex h-16 items-center justify-between">
              <Link
                to="/"
                className="text-xl font-bold text-gray-900 dark:text-white"
              >
                My Blog
              </Link>
              <div className="flex items-center space-x-6">
                <ul className="flex space-x-4">
                  <li>
                    <Link
                      to="/"
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/posts"
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    >
                      All Posts
                    </Link>
                  </li>
                </ul>

                <div className="flex items-center space-x-4">
                  <Login />
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-zinc-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <span className="sr-only">Toggle theme</span>
                    <svg
                      className="h-5 w-5 hidden dark:block"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    <svg
                      className="h-5 w-5 block dark:hidden"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </nav>
          </div>
        </header>

        <main className="flex-1 flex justify-center py-8">
          <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/posts" element={<Posts />} />
            </Routes>
          </div>
        </main>

        <footer className="bg-white dark:bg-zinc-800 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-600 dark:text-gray-300">
            <p>
              &copy; {new Date().getFullYear()} My Blog. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
