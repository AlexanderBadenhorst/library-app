import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { auth } from "./firebase"; // Import the auth object
import Auth from "./Auth"; // Your login component
import Library from "./Library"; // Your library component

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user); // Set the current user state based on authentication status
    });

    return () => unsubscribe(); // Clean up the subscription on unmount
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Auth currentUser={currentUser} />} />
        <Route
          path="/library"
          element={
            currentUser ? (
              <Library currentUser={currentUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/"
          element={
            currentUser ? <Navigate to="/library" /> : <Navigate to="/login" />
          }
        />
        <Route
          path="*"
          element={<Navigate to={currentUser ? "/library" : "/login"} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
