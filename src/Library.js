import React, { useState, useEffect } from "react";
import { db, auth } from "./firebase"; 
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  getDocs,
} from "firebase/firestore";
import { signOut } from "firebase/auth"; 
import { useNavigate } from "react-router-dom"; 
import "./Library.css"; 
import waveImage from './images/wave.svg';
import waveImage2 from './images/wave2.svg';

const BookForm = ({ book, onChange, onSubmit, error }) => (
  <div className="add-book-form">
    <input
      type="text"
      name="title"
      value={book.title}
      onChange={onChange}
      placeholder="Book Title"
      className="book-input"
    />
    <input
      type="text"
      name="author"
      value={book.author}
      onChange={onChange}
      placeholder="Author"
      className="book-input"
    />
    <input
      type="text"
      name="isbn"
      value={book.isbn}
      onChange={onChange}
      placeholder="ISBN Number"
      className="book-input"
    />
    <button onClick={onSubmit} className="submit-button">
      {book.id ? "Update Book" : "Add Book"}
    </button>
    {error && <p className="error-message">{error}</p>}
  </div>
);

const BookItem = ({ book, onEdit, onDelete }) => (
  <div className="book-card">
    <h3 className="book-title">{book.title}</h3>
    <p className="book-author">Author: {book.author}</p>
    <p className="book-isbn">ISBN: {book.isbn}</p>
    <button onClick={onEdit}>Edit</button>
    <button onClick={onDelete}>Delete</button>
  </div>
);

const Library = ({ currentUser  }) => {
  const [books, setBooks] = useState([]);
  const [book, setBook] = useState({ title: "", author: "", isbn: "" });
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("title");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "library"), (snapshot) => {
      const bookList = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((book) => book.userId === currentUser .uid);
      setBooks(bookList);
    });

    return () => unsubscribe();
  }, [currentUser .uid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setError("");
    if (!book.title.trim() || !book.author.trim() || !book.isbn.trim()) {
      setError("All fields are required.");
      return;
    }

    try {
      if (book.id) {
        await setDoc(doc(db, "library", book.id), {
          title: book.title,
          author: book.author,
          isbn: book.isbn,
          userId: currentUser .uid,
        });
      } else {
        await addDoc(collection(db, "library"), {
          title: book.title,
          author: book.author,
          isbn: book.isbn,
          userId: currentUser .uid,
        });
      }
      setBook({ title: "", author: "", isbn: "" }); // Reset form
    } catch (error) {
      setError("Failed to save book. Please try again.");
    }
  };

  const handleEdit = (book) => {
    setBook(book);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "library", id));
    } catch (error) {
      setError("Failed to delete book. Please try again.");
    }
  };

  const filteredBooks = books
    .filter(book => 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a[sortOption].localeCompare(b[sortOption]));

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // Redirect to login page after sign out
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className="library-container">
          <div class="fixed-top-border"></div>
          <div class="fixed-bottom-border"></div>
        <div className="wave-container">
            <img src={waveImage2} alt="Orange Wave Background" className="wave-background" style={{ position: 'fixed', top: 0, width: '100%', height: '50vh', zIndex: -1 }} />
            <img src={waveImage} alt="Blue Wave Background" className="wave-background" style={{ position: 'fixed', bottom: 0, width: '100%', height: '50vh', zIndex: -1 }} />
        </div>
        <h1 class="library-header">Library</h1>
        <button className="sign-out-button" onClick={handleSignOut}>Sign Out</button>
        <h2 className="add-book-header">Add New Book</h2>
        <BookForm book={book} onChange={handleChange} onSubmit={handleSubmit} error={error} />
        
        <h2 className="your-books-header">Your Books</h2>
        <input 
            type="text" 
            placeholder="Search by title or author" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="search-input"
        />
        <select 
            value={sortOption} 
            onChange={(e) => setSortOption(e.target.value)} 
            className="sort-select"
        >
            <option value="title">Sort by Title</option>
            <option value="author">Sort by Author</option>
        </select>
        
        <div className="book-grid">
            {filteredBooks.map((book) => (
                <BookItem
                    key={book.id}
                    book={book}
                    onEdit={() => handleEdit(book)}
                    onDelete={() => handleDelete(book.id)}
                />
            ))}
        </div>
    </div>
);
};

export default Library;