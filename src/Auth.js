import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase"; // Import auth and db objects
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { collection, addDoc } from "firebase/firestore"; // Import Firestore functions
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import "./Auth.css"; // Import the updated CSS file
import background from "./images/background.svg"; // Import the background SVG

const Auth = ({ currentUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State for error messages
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Redirect to library if user is already authenticated
  useEffect(() => {
    if (currentUser) {
      navigate("/library");
    }
  }, [currentUser, navigate]);

  const addUser = async (userData) => {
    try {
      const docRef = await addDoc(collection(db, "users"), userData);
      console.log("User  added with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding user: ", e);
    }
  };

  const handleSignUp = async () => {
    setError(""); // Clear any previous error
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Add user to Firestore
      await addUser({ uid: user.uid, email: user.email });

      // Navigate to library page after successful signup
      navigate("/library");
    } catch (error) {
      console.error(error);
      setError(error.message); // Set error message for display
    }
  };

  const handleSignIn = async () => {
    setError(""); // Clear any previous error
    try {
      await signInWithEmailAndPassword(auth, email, password);

      // Navigate to library page after successful login
      navigate("/library");
    } catch (error) {
      console.error(error);
      setError(error.message); // Set error message for display
    }
  };

  return (
    <div
      className="auth-container"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div
        className="auth-background"
        style={{ backgroundImage: `url(${background})` }}
      ></div>
      {/* Greeting Message */}
      <h1 className="auth-header">
        {currentUser
          ? `Welcome back, ${currentUser.email}!`
          : "Welcome! Please log in or sign up."}
      </h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="form-input"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="form-input"
      />
      <button onClick={handleSignIn} className="sign-in">
        Log In
      </button>
      <button onClick={handleSignUp} className="sign-up">
        Sign Up
      </button>
      {error && <p className="error-message">{error}</p>}{" "}
      {/* Display error message */}
    </div>
  );
};

export default Auth;
