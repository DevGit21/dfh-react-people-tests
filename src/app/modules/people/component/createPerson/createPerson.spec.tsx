import { screen, fireEvent } from "@testing-library/react";
import { CreatePerson } from "./createPerson.component";
import { renderWithProviders } from "../../../../shared/util";

// render CreatePerson component
const renderCreatePerson = async () => {
  renderWithProviders(<CreatePerson />);
  expect(
    screen.getByRole("heading", { name: "Create New Person" }),
  ).toBeInTheDocument();
};

describe("CreatePerson Component", () => {
  test("renders form", async () => {
    await renderCreatePerson();
    expect(screen.getByRole("form")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /create new person/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/actor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
    expect(screen.getByText(/add movie/i)).toBeInTheDocument(); // Button to add movie fields
    expect(screen.getByText(/Create Person/i)).toBeInTheDocument();
  });

  test("prevents form submission when required fields are missing", async () => {
    await renderCreatePerson();

    // Submit the empty form
    fireEvent.click(screen.getByText(/Create Person/i));

    expect(screen.getByText(/All fields are required./i)).toBeInTheDocument();
  });

  test("fills out form and submits", async () => {
    await renderCreatePerson();

    // Fill out form fields
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/show/i), {
      target: { value: "Show 1" },
    });
    fireEvent.change(screen.getByLabelText(/actor/i), {
      target: { value: "Actor" },
    });
    fireEvent.change(screen.getByLabelText(/date of birth/i), {
      target: { value: "1990-01-01" },
    });

    // Add a movie
    fireEvent.click(screen.getByText(/add movie/i));
    fireEvent.change(screen.getAllByPlaceholderText(/movie title/i)[0], {
      target: { value: "Movie 1" },
    });
    fireEvent.change(screen.getAllByPlaceholderText(/release date/i)[0], {
      target: { value: "2020-12-01" },
    });

    // Submit the form
    fireEvent.click(screen.getByText(/Create Person/i));

    // Success message
    expect(
      screen.getByText(/Person created successfully!/i),
    ).toBeInTheDocument();
  });
});
