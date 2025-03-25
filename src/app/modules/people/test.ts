import { Person } from "./model";
import { usePeopleQuery } from "./query";
import { useState } from "react";

import "./people.css";

export function People() {
  const { data: people, loading, error } = usePeopleQuery();

  // State for sorting
  const [sortOrder, setSortOrder] = useState<'ascending' | 'descending'>('ascending');
  const [sortColumn, setSortColumn] = useState<string>('name');
  const [searchQuery, setSearchQuery] = useState<string>(''); // State for search input

  // Function to handle sorting logic
  const handleSort = (column: string) => {
    const isSameColumn = sortColumn === column;
    const newSortOrder = isSameColumn && sortOrder === 'ascending' ? 'descending' : 'ascending';
    setSortColumn(column);
    setSortOrder(newSortOrder);
  };

  // Function to handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter and sort the people based on the search query and sort column
  const filteredPeople = people
    ? people.filter((person) =>
        person.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const sortedPeople = filteredPeople.sort((a, b) => {
    if (sortColumn === 'name') {
      return sortOrder === 'ascending'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    // You can add more sorting conditions for other columns if needed
    return 0; // Default no sorting
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default to 10 items per page
  const totalItems = people ? people.length : 0; // Assuming there are 100 people in total

  // Handling Pagination Logic
  const handlePageChange = (page: number) => {
    if (page < 1 || page > Math.ceil(totalItems / itemsPerPage)) return;
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to the first page when items per page is changed
  };

  // Calculating the current page's items
  const indexOfLastPerson = currentPage * itemsPerPage;
  const indexOfFirstPerson = indexOfLastPerson - itemsPerPage;
  const currentPeople = sortedPeople.slice(indexOfFirstPerson, indexOfLastPerson);

  // Handling next/previous page navigation
  const goToNextPage = () => {
    if (currentPage < Math.ceil(totalItems / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToFirstPage = () => setCurrentPage(1);

  const goToLastPage = () => setCurrentPage(Math.ceil(totalItems / itemsPerPage));

  const renderCells = ({ name, show, actor, movies, dob }: Person) => (
    <>
      <td>{name}</td>
      <td>{show}</td>
      <td>{actor}</td>
      <td>{dob}</td>
      <td
        dangerouslySetInnerHTML={{
          __html: movies.map(({ title }) => title).join(", "),
        }}
      ></td>
    </>
  );

  if (loading) {
    return <p>Fetching People...</p>;
  }

  if (people === undefined || error) {
    return <h2>Oops! looks like something went wrong!</h2>;
  }

  if (people.length === 0) {
    return "No People Available.";
  }

  return (
    <>
      {/* Search input */}
      <input
        type="text"
        placeholder="Search by name"
        value={searchQuery}
        onChange={handleSearchChange}
        role="textbox"
        aria-label="Search"
      />
    <table>
      <thead>
        <tr>
        <th
            onClick={() => handleSort('name')}
            role="columnheader"
            aria-sort={sortColumn === 'name' ? sortOrder : 'none'}
          >
            Name
          </th>
          <th>Show</th>
          <th>Actor/Actress</th>
          <th>Date of birth</th>
          <th>Movies</th>
        </tr>
      </thead>

      <tbody>
        {currentPeople.map((people, index) => (
          <tr key={index}>{renderCells(people)}</tr>
        ))}
      </tbody>
    </table>
     {/* Pagination Controls */}
     <div className="pagination">
        <button onClick={goToFirstPage} disabled={currentPage === 1}>First</button>
        <button onClick={goToPreviousPage} disabled={currentPage === 1}>Previous</button>
        <button onClick={goToNextPage} disabled={currentPage === Math.ceil(totalItems / itemsPerPage)}>Next</button>
        <button onClick={goToLastPage} disabled={currentPage === Math.ceil(totalItems / itemsPerPage)}>Last</button>

        <span>
          Showing {indexOfFirstPerson + 1}-{Math.min(indexOfLastPerson, totalItems)} of {totalItems}
        </span>

        {/* Items per page combobox */}
        <select onChange={handleItemsPerPageChange} value={itemsPerPage} role="combobox">
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>
      </div>
    </>
  );
}
