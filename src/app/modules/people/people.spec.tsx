import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { http, HttpResponse } from "msw";

import { server } from "../../../api-mocks/server";
import { getPeople } from "../../../api-mocks/handlers/people.handler";
import { renderWithProviders, waitForLoading } from "../../shared/util";
import { People } from "./people.component";

// Mocking the data
const mockPeopleData = [
  {
    id: 1,
    name: "Addie Duncan",
    show: "Show 1",
    actor: "Actor 1",
    dob: "1990-01-01",
    movies: [{ title: "Movie A" }],
  },
  {
    id: 2,
    name: "Zelma Mcdaniel",
    show: "Show 2",
    actor: "Actor 2",
    dob: "1991-02-02",
    movies: [{ title: "Movie B" }],
  },
  {
    id: 3,
    name: "Ball Higgins",
    show: "Show 3",
    actor: "Actor 3",
    dob: "1992-03-03",
    movies: [{ title: "Movie C" }],
  },
  {
    id: 4,
    name: "Singleton Ball",
    show: "Show 4",
    actor: "Actor 4",
    dob: "1993-04-04",
    movies: [{ title: "Movie D" }],
  },
  {
    id: 5,
    name: "Sammy Davis",
    show: "Show 5",
    actor: "Actor 5",
    dob: "1994-05-05",
    movies: [{ title: "Movie E" }],
  },
  {
    id: 6,
    name: "Danny Sullivan",
    show: "Show 6",
    actor: "Actor 6",
    dob: "1995-06-06",
    movies: [{ title: "Movie F" }],
  },
  {
    id: 7,
    name: "Amy Moore",
    show: "Show 7",
    actor: "Actor 7",
    dob: "1996-07-07",
    movies: [{ title: "Movie G" }],
  },
  {
    id: 8,
    name: "Ella Stone",
    show: "Show 8",
    actor: "Actor 8",
    dob: "1997-08-08",
    movies: [{ title: "Movie H" }],
  },
  {
    id: 9,
    name: "Mark Ball",
    show: "Show 9",
    actor: "Actor 9",
    dob: "1998-09-09",
    movies: [{ title: "Movie I" }],
  },
  {
    id: 10,
    name: "Nancy Brown",
    show: "Show 10",
    actor: "Actor 10",
    dob: "1999-10-10",
    movies: [{ title: "Movie J" }],
  },
];

// Helper function to render People component and wait for loading
const renderPeople = async () => {
  renderWithProviders(<People />);
  await waitForLoading("Fetching People");
};

// Mock API response for default data
server.use(
  http.get(getPeople.info.path, () => HttpResponse.json(mockPeopleData)),
);

describe("People Component", () => {
  test("renders table", async () => {
    await renderPeople();
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  test("handles error response", async () => {
    server.use(http.get(getPeople.info.path, () => HttpResponse.error()));
    await renderPeople();
    expect(
      screen.getByRole("heading", {
        name: "Oops! looks like something went wrong!",
      }),
    ).toBeInTheDocument();
  });

  test("displays an empty state when no data is returned", async () => {
    server.use(http.get(getPeople.info.path, () => HttpResponse.json([])));
    await renderPeople();
    expect(screen.getByText("No People Available.")).toBeInTheDocument();
  });

  test("should display 10 people by default", async () => {
    await renderPeople();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByRole("row").slice(1)).toHaveLength(10);
  });

  describe("Filtering", () => {
    test("should select the sort column", async () => {
      const user = userEvent.setup();
      await renderPeople();

      expect(screen.getByRole("table")).toBeInTheDocument();
      expect(
        within(screen.getAllByRole("row")[1]).getByText("Addie Duncan"),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("columnheader", { name: "Name" }),
      ).toHaveAttribute("aria-sort", "ascending");

      await user.click(screen.getByRole("columnheader", { name: "Name" }));
      expect(
        screen.getByRole("columnheader", { name: "Name" }),
      ).toHaveAttribute("aria-sort", "descending");
      expect(
        within(screen.getAllByRole("row")[1]).getByText("Zelma Mcdaniel"),
      ).toBeInTheDocument();
    });

    test("should filter the list by name", async () => {
      const user = userEvent.setup();
      await renderPeople();
      await user.type(screen.getByRole("textbox", { name: "Search" }), "Ball");
      expect(screen.getAllByRole("row").slice(1)).toHaveLength(2);
      expect(
        within(screen.getAllByRole("row")[1]).getByText("Ball Higgins"),
      ).toBeInTheDocument();
      expect(
        within(screen.getAllByRole("row")[2]).getByText("Singleton Ball"),
      ).toBeInTheDocument();
    });
  });

  describe("Pagination", () => {
    test("should update number of people displayed", async () => {
      const user = userEvent.setup();
      const mockPeopleData = new Array(100).fill(null).map((_, index) => ({
        name: `Person ${index + 1}`,
        show: `Show ${index + 1}`,
        actor: `Actor ${index + 1}`,
        dob: "01/01/1990",
        movies: [{ title: `Movie ${index + 1}` }],
      }));
      server.use(
        http.get(getPeople.info.path, () => HttpResponse.json(mockPeopleData)),
      );

      await renderPeople();
      expect(screen.getByRole("table")).toBeInTheDocument();
      expect(screen.getAllByRole("row").slice(1)).toHaveLength(10);
      expect(screen.getByText("Showing 1-10 of 100")).toBeInTheDocument();

      await user.selectOptions(screen.getByRole("combobox"), "15");
      expect(screen.getAllByRole("row").slice(1)).toHaveLength(15);
      expect(screen.getByText("Showing 1-15 of 100")).toBeInTheDocument();

      await user.selectOptions(screen.getByRole("combobox"), "20");
      expect(screen.getByText("Showing 1-20 of 100")).toBeInTheDocument();
      expect(screen.getAllByRole("row").slice(1)).toHaveLength(20);
    });

    test("should go to the next page", async () => {
      const user = userEvent.setup();
      await renderPeople();
      expect(screen.getByText("Showing 1-10 of 100")).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "Next" }));
      expect(screen.getByText("Showing 11-20 of 100")).toBeInTheDocument();
    });

    test("should go to the previous page", async () => {
      const user = userEvent.setup();
      await renderPeople();
      expect(screen.getByText("Showing 1-10 of 100")).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "Next" }));
      expect(screen.getByText("Showing 11-20 of 100")).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "Previous" }));
      expect(screen.getByText("Showing 1-10 of 100")).toBeInTheDocument();
    });

    test("should go to the last page", async () => {
      const user = userEvent.setup();
      await renderPeople();
      expect(screen.getByText("Showing 1-10 of 100")).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "Last" }));
      expect(screen.getByText("Showing 91-100 of 100")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
      expect(screen.getByRole("button", { name: "Last" })).toBeDisabled();
    });

    test("should go to the first page", async () => {
      const user = userEvent.setup();
      await renderPeople();
      expect(screen.getByText("Showing 1-10 of 100")).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "Last" }));
      expect(screen.getByText("Showing 91-100 of 100")).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "First" }));
      expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
      expect(screen.getByRole("button", { name: "First" })).toBeDisabled();
    });
  });
});
