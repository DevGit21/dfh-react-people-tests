import { Person } from "./model";
import { usePeopleQuery } from "./query";
import { useState, useMemo } from "react";
import "./people.css";

export function People() {
  const { data: people, loading, error } = usePeopleQuery();

  // State for sorting and filtering
  const [sortOrder, setSortOrder] = useState<'ascending' | 'descending'>('ascending');
  const [sortColumn, setSortColumn] = useState<string>('name');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalItems = people ? people.length : 0;

  // Handle Sorting Logic
  const handleSort = (column: string) => {
    const newSortOrder = (sortColumn === column && sortOrder === 'ascending') ? 'descending' : 'ascending';
    setSortColumn(column);
    setSortOrder(newSortOrder);
  };

  // Handle Search Logic
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter people based on the search query
  const filteredPeople = useMemo(() => {
    return people?.filter(person =>
      person.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];
  }, [people, searchQuery]);

  // Sort filtered people based on the sort column and order
  const sortedPeople = useMemo(() => {
    return filteredPeople.sort((a, b) => {
      if (sortColumn === 'name') {
        return sortOrder === 'ascending' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      }
      return 0; // Default no sorting for other columns
    });
  }, [filteredPeople, sortColumn, sortOrder]);

  // Pagination Logic
  const handlePageChange = (page: number) => {
    if (page < 1 || page > Math.ceil(totalItems / itemsPerPage)) return;
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to the first page when items per page is changed
  };

  const indexOfLastPerson = currentPage * itemsPerPage;
  const indexOfFirstPerson = indexOfLastPerson - itemsPerPage;
  const currentPeople = sortedPeople.slice(indexOfFirstPerson, indexOfLastPerson);

  // Pagination Button Handlers
  const goToNextPage = () => handlePageChange(currentPage + 1);
  const goToPreviousPage = () => handlePageChange(currentPage - 1);
  const goToFirstPage = () => handlePageChange(1);
  const goToLastPage = () => handlePageChange(Math.ceil(totalItems / itemsPerPage));

  // Render Table Cells
  const renderCells = ({ name, show, actor, movies, dob }: Person): JSX.Element[] => [
    <td key="name">{name}</td>,
    <td key="show">{show}</td>,
    <td key="actor">{actor}</td>,
    <td key="dob">{dob}</td>,
    <td key="movies">{movies.map(({ title }) => title).join(", ")}</td>
];


  if (loading) return <p>Fetching People...</p>;
  if (error || !people) return <h2>Oops! looks like something went wrong!</h2>;
  if (people.length === 0) return "No People Available.";

  return (
    <div className="people-container">
      <input
        type="text"
        placeholder="Search by name"
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-input"
        aria-label="Search"
      />

      <table className="people-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('name')} role="columnheader" aria-sort={sortColumn === 'name' ? sortOrder : 'none'}>
              Name
            </th>
            <th>Show</th>
            <th>Actor/Actress</th>
            <th>Date of Birth</th>
            <th>Movies</th>
          </tr>
        </thead>
        <tbody>
          {currentPeople.map((person, index) => (
            <tr key={index}>{renderCells(person)}</tr>
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

        <select onChange={handleItemsPerPageChange} value={itemsPerPage} className="items-per-page-select" role="combobox">
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>
      </div>
    </div>
  );
}
