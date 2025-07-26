import { ReactNode } from "react";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'

// Props for Table
interface TableProps {
  children: ReactNode; // Table content (thead, tbody, etc.)
  className?: string; // Optional className for styling
}

// Props for TableHeader
interface TableHeaderProps {
  children: ReactNode; // Header row(s)
  className?: string; // Optional className for styling
}

// Props for TableBody
interface TableBodyProps {
  children: ReactNode; // Body row(s)
  className?: string; // Optional className for styling
}

// Props for TableRow
interface TableRowProps {
  children: ReactNode; // Cells (th or td)
  className?: string; // Optional className for styling
}

// Props for TableCell
interface TableCellProps {
  children: ReactNode; // Cell content
  isHeader?: boolean; // If true, renders as <th>, otherwise <td>
  className?: string; // Optional className for styling
  colSpan?: number; // Optional colspan or rowspan attributes
}

// Props for SearchControls
interface SearchControlProps {
  value: string;
  onChange: (value: string) => void;
}

// Props for PaginationControls
interface PaginationControlProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (count: number) => void;
}

// Table Component
const Table: React.FC<TableProps> = ({ children, className }) => {
  return <table className={`min-w-full  ${className}`}>{children}</table>;
};

// TableHeader Component
const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
  return <thead className={className}>{children}</thead>;
};

// TableBody Component
const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
  return <tbody className={className}>{children}</tbody>;
};

// TableRow Component
const TableRow: React.FC<TableRowProps> = ({ children, className }) => {
  return <tr className={className}>{children}</tr>;
};

// TableCell Component
const TableCell: React.FC<TableCellProps> = ({
  children,
  isHeader = false,
  colSpan,
  className,
}) => {
  const CellTag = isHeader ? "th" : "td";
  return <CellTag className={` ${className}`} colSpan={colSpan}>{children}</CellTag>;
};

// SearchField Component
const SearchControl: React.FC<SearchControlProps> = ({ value, onChange }) => {
  return (
    <div className="relative w-full max-w-xs m-4">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
          clipRule="evenodd"
        />
      </svg>

      <input
        type="text"
        placeholder="Search by name or email..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-1 rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:focus:ring-blue-400 dark:focus:border-blue-400"
      />
    </div>
  );
};

// PaginationControl Component
const PaginationControl: React.FC<PaginationControlProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  return (
    <div className="flex justify-between items-center px-4 py-2">
      <div className="flex items-center text-sm">
        <label htmlFor="entriesPerPage" className="mr-2 text-gray-600 dark:text-gray-300">
          Show
        </label>

        <Listbox value={itemsPerPage} onChange={(value: number) => {
          onItemsPerPageChange(value);
          onPageChange(1);
        }}>
          {({ open }) => (
            <div>
              <ListboxButton className="border px-2 py-1 rounded-md">
                {itemsPerPage}
              </ListboxButton>

              {open && (
                <ListboxOptions  className="mt-1 rounded-md border bg-white shadow-lg dark:bg-gray-800">
                  {[5, 10, 25, 50].map((n) => (
                    <ListboxOption
                      key={n}
                      value={n}
                      className={({ active, selected }) =>
                        `cursor-pointer px-3 py-1 ${
                          active ? 'bg-gray-100 dark:bg-gray-700' : ''
                        } ${selected ? 'font-semibold' : ''}`
                      }
                      as="button"
                      type="button"
                    >
                      {n}
                    </ListboxOption>
                  ))}
                </ListboxOptions >
              )}
            </div>
          )}
        </Listbox>

        <span className="ml-2 text-gray-600 dark:text-gray-300">
          entries per page
        </span>
      </div>

      <div className="flex items-center text-sm">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-2 mr-2 py-1 border rounded-full disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-2 ml-2 py-1 border rounded-full disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export { Table, TableHeader, TableBody, TableRow, TableCell, SearchControl, PaginationControl };
