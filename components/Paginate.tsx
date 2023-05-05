import React from "react";

type PaginateFunction = (pageNumber: number) => void;

interface PaginateProps {
  currentPage: number;
  totalPages: number;
  paginate: PaginateFunction;
}

const Paginate: React.FC<PaginateProps> = ({
  currentPage,
  totalPages,
  paginate,
}) => {
  const pageNumbers = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const previousPage = () => {
    if (currentPage > 1) {
      paginate(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      paginate(currentPage + 1);
    }
  };

  return (
    <>
      <div className="pagination-container">
        <ul className="pagination">
          <button onClick={previousPage} className="page-number">
            Prev
          </button>
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              className={`page-number${currentPage === number ? " active" : ""
                }`}
            >
              {number}
            </button>
          ))}
          <button onClick={nextPage} className="page-number">
            Next
          </button>
        </ul>
      </div>
      <style jsx>{`
        .pagination-container {
          display: flex;
          justify-content: center;
          margin: 2rem 0;
          padding: 1rem;
          border: 1px solid #ccc;
          border-radius: 0.25rem;
        }
        ul {
          list-style-type: none;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        button {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 5px;
          margin-right: 10px;
        }
        button:hover {
          color: white;
          background-color: #4caf50;
        }
        .pagination {
          display: inline-block;
          padding: 0.5rem 1rem;
          margin: 0 0.25rem;
          background-color: #eee;
          border: 1px solid #ccc;
          border-radius: 0.25rem;
          text-decoration: none;
          color: #111;
        }
        .active {
          background-color: #4caf50;
          color: white;
        }
      `}</style>
    </>
  );
};

export default Paginate;
