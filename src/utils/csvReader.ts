import Papa from "papaparse";

export interface RowData {
  [key: string]: string | number;
}

export async function readCSV(tableName: string): Promise<RowData[]> {
  const csvFilePath = `/data/${tableName}.csv`;

  try {
    const response = await fetch(csvFilePath);
    const csvString = await response.text();

    return new Promise<RowData[]>((resolve, reject) => {
      Papa.parse(csvString, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          if (result.errors.length > 0) {
            reject(result.errors[0]);
          } else {
            resolve(result.data as RowData[]);
          }
        },
      });
    });
  } catch (error) {
    console.error("Error reading CSV:", error);
    return [];
  }
}

export async function joinCSV(
  table1Name: string,
  table2Name: string,
  joinColumn: string
): Promise<RowData[]> {
  try {
    const table1Data = await readCSV(table1Name);
    const table2Data = await readCSV(table2Name);

    const joinedData = table1Data.map((row1) => {
      const matchingRow2 = table2Data.find(
        (row2) => row2[joinColumn] === row1[joinColumn]
      );
      return { ...row1, ...matchingRow2 };
    });

    return joinedData;
  } catch (error) {
    console.error("Error joining CSV:", error);
    return [];
  }
}
