import { useState } from "react";
import { Person } from "../../model";
import "./createPerson.css";

export function CreatePerson() {
  const [newPerson, setNewPerson] = useState<Person>({
    id: "",
    name: "",
    show: "",
    actor: "",
    movies: [],
    dob: "",
    updatedAt: new Date().toISOString(), // current date as default
  });

  const [formError, setFormError] = useState<string>("");
  const [formSuccess, setFormSuccess] = useState<string>("");

  // Handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPerson((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle changes in the movie fields
  const handleMovieChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, field: "title" | "released") => {
    const { value } = e.target;
    setNewPerson((prev) => {
      const updatedMovies = [...prev.movies];
      updatedMovies[index] = { ...updatedMovies[index], [field]: value };
      return { ...prev, movies: updatedMovies };
    });
  };

  // Add a new movie field
  const addMovieField = () => {
    setNewPerson((prev) => ({
      ...prev,
      movies: [...prev.movies, { title: "", released: "" }],
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // validation
    if (!newPerson.name || !newPerson.show || !newPerson.actor || !newPerson.dob || newPerson.movies.length === 0) {
      setFormError("All fields are required.");
      return;
    }



    // unique ID
    const newPersonWithId = {
      ...newPerson,
      id: `${newPerson.name.toLowerCase().replace(/ /g, "_")}-${Date.now()}`,
    };

    setFormSuccess("Person created successfully!");

    // clear form after submission
    setNewPerson({
      id: "",
      name: "",
      show: "",
      actor: "",
      movies: [],
      dob: "",
      updatedAt: new Date().toISOString(),
    });
    setFormError(""); // Reset error message
  };

  return (
    <div className="create-person-form-container">
      <form onSubmit={handleSubmit} name="" className="create-person-form" noValidate>
        <h2>Create New Person</h2>

        {/* Display form error */}
        {formError && <p className="form-error">{formError}</p>}

        {/* Display form success */}
        {formSuccess && <p className="form-sucsess">{formSuccess}</p>}

        {/* Name Input */}
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          type="text"
          name="name"
          value={newPerson.name}
          onChange={handleInputChange}
          required
        />

        {/* Show Input */}
        <label htmlFor="show">Show:</label>
        <input
          id="show"
          type="text"
          name="show"
          value={newPerson.show}
          onChange={handleInputChange}
        />

        {/* Actor Input */}
        <label htmlFor="actor">Actor:</label>
        <input
          id="actor"
          type="text"
          name="actor"
          value={newPerson.actor}
          onChange={handleInputChange}
          required
        />

        {/* Date of Birth Input */}
        <label htmlFor="dob">Date of Birth:</label>
        <input
          id="dob"
          type="date"
          name="dob"
          value={newPerson.dob}
          onChange={handleInputChange}
          required
        />

        {/* Movies Section */}
        <label>Movies:</label>
        {newPerson.movies.map((movie, index) => (
          <div key={index} className="movie-fields">
            <input
              type="text"
              placeholder="Movie Title"
              value={movie.title}
              onChange={(e) => handleMovieChange(e, index, "title")}
              required
            />
            <input
              type="date"
              placeholder="Release Date"
              value={movie.released}
              onChange={(e) => handleMovieChange(e, index, "released")}
              required
            />
          </div>
        ))}
        <button type="button" onClick={addMovieField} className="add-movie-btn">
          Add Movie
        </button>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Create Person
          </button>
        </div>
      </form>
    </div>
  );
}
