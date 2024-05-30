import React, { useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';

const App = () => {
    const [isAuth, setAuth] = useState(false);

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
          setAuth(true);
      }
  }, []);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login setAuth={setAuth} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={isAuth ? <Dashboard setAuth={setAuth} /> : <Login setAuth={setAuth} />} />
            </Routes>
        </Router>
    );
};

export default App;
