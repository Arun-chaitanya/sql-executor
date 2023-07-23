import React from "react";
import { useTable } from "react-table";
import { RowData } from "../../utils/csvReader";
import "./Table.css";

interface TableProps {
  tableName?: string;
  data: RowData[];
}

const Table: React.FC<TableProps> = ({ tableName, data }) => {
  const columns = React.useMemo(
    () =>
      data.length > 0
        ? Object.keys(data[0]).map((key) => ({
            Header: key,
            accessor: key,
          }))
        : [],
    [data]
  );

  // Exclude the first row (column names) from the data when rendering
  const tableData = data.slice(1);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: tableData });

  return (
    <div className="tableContainer">
      {tableName && <h3>{tableName}</h3>}
      <div className="tableWrapper">
        <table
          {...getTableProps()}
          style={{
            border: "solid 1px black",
            borderCollapse: "collapse",
            width: "100%",
          }}
        >
          <thead>
            {headerGroups.map((headerGroup, index) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    style={{ border: "solid 1px black", padding: "8px" }}
                    key={column.id}
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, index) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={index}>
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps()}
                      style={{ border: "solid 1px black", padding: "8px" }}
                      key={cell.column.id}
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default React.memo(Table);
