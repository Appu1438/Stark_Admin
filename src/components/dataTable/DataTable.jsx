import React, { useMemo, useState } from "react";
import { Search } from "@mui/icons-material";
import { useTable, useSortBy, usePagination } from "react-table";
import "./dataTable.css";
import { AuthContext } from "../../context/authContext/AuthContext";
import { useContext } from "react";

export default function DataTable({
    title = "Table",
    data = [],
    columns = [],
    showCreate = false,
    onCreateClick,
    buttonName,
    onButtonClick,
    searchPlaceholder = "Search...",
    showFilter = false,
    filterOptions = [],
    filterKey = null,
}) {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");
    const { user } = useContext(AuthContext); // 👈 logged-in admin


    // 🔍 Combined Search + Filter Logic
    const filteredData = useMemo(() => {
        let result = Array.isArray(data) ? [...data] : [];
        const now = new Date();

        // 🔹 Text search across all string fields
        if (search) {
            const searchLower = search.toLowerCase();

            const flattenValues = (obj) => {
                let values = [];
                for (const key in obj) {
                    const val = obj[key];
                    if (!val) continue;

                    if (typeof val === "object") {
                        values = values.concat(flattenValues(val)); // recursively extract nested values
                    } else if (typeof val === "string" || typeof val === "number") {
                        values.push(String(val)); // convert numbers to string for matching
                    }
                }
                return values;
            };

            result = result.filter((item) => {
                const allValues = flattenValues(item);
                return allValues.some((val) => val.toLowerCase().includes(searchLower));
            });
        }

        // 🔹 Filter logic (driver-specific)
        const adminId = user?._id?.toString();
        switch (filter) {

            case "License Expired":
                result = result.filter(
                    (item) =>
                        item.license_expiry && new Date(item.license_expiry) < now
                );
                break;

            case "Insurance Expired":
                result = result.filter(
                    (item) =>
                        item.insurance_expiry && new Date(item.insurance_expiry) < now
                );
                break;

            case "Both Expired":
                result = result.filter(
                    (item) =>
                        item.license_expiry &&
                        new Date(item.license_expiry) < now &&
                        item.insurance_expiry &&
                        new Date(item.insurance_expiry) < now
                );
                break;
            case "Mine":
                result = result.filter((item) => {
                    const handledById =
                        typeof item.adminHandledBy === "string"
                            ? item.adminHandledBy
                            : item.adminHandledBy?._id;

                    return handledById?.toString() === adminId;
                });
                break;

            default:
                // Optional: if you want to use a generic key-based filter (like status)
                if (filter && filterKey) {
                    result = result.filter(
                        (item) =>
                            item[filterKey]?.toLowerCase() === filter.toLowerCase()
                    );
                }
                break;
        }

        return result;
    }, [data, search, filter, filterKey]);

    const tableColumns = useMemo(() => {
        if (buttonName) {
            return [
                ...columns,
                {
                    Header: "Actions",
                    accessor: "_id",
                    Cell: ({ row }) => (
                        <button
                            className="editButton"
                            onClick={() => onButtonClick(row.original)}
                        >
                            {buttonName}
                        </button>
                    ),
                },
            ];
        }
        return columns;
    }, [columns, onButtonClick]);

    // ✅ react-table setup
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        nextPage,
        previousPage,
        state: { pageIndex, pageSize },
        setPageSize,
    } = useTable(
        {
            columns: tableColumns,
            data: filteredData,
            initialState: { pageIndex: 0, pageSize: 10 },
        },
        useSortBy,
        usePagination
    );

    return (
        <div className="dataTable">
            {/* Header */}
            <div className="tableHeader">
                <h2>{title}</h2>
                {showCreate && (
                    <button className="createButton" onClick={onCreateClick}>
                        Create
                    </button>
                )}
            </div>

            {/* Search + Filter */}
            <div className="searchFilterRow">
                <div className="searchBar">
                    <Search className="searchIcon" />
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {filterOptions.length > 0 && showFilter && (
                    <div className="filterBar">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="">All</option>
                            {filterOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Table */}
            <table {...getTableProps()} className="reactTable">
                <thead>
                    {headerGroups.map((hg) => (
                        <tr key={hg.id} {...hg.getHeaderGroupProps()}>
                            {hg.headers.map((col) => (
                                <th
                                    key={col.id}
                                    {...col.getHeaderProps(col.getSortByToggleProps())}
                                >
                                    {col.render("Header")}
                                    <span>
                                        {col.isSorted
                                            ? col.isSortedDesc
                                                ? " 🔽"
                                                : " 🔼"
                                            : ""}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row) => {
                        prepareRow(row);
                        return (
                            <tr key={row.id} {...row.getRowProps()}>
                                {row.cells.map((cell) => (
                                    <td key={cell.column.id} {...cell.getCellProps()}>
                                        {cell.render("Cell")}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination">
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    Prev
                </button>
                <span>
                    Page {pageIndex + 1} of {pageOptions.length}
                </span>
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    Next
                </button>
                <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                >
                    {[5, 10, 20, 50].map((size) => (
                        <option key={size} value={size}>
                            {size} / page
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
