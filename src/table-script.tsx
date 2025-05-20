import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef
} from "material-react-table";
import { useMemo } from "react";
import sourceData from "./source-data.json";
import type { PercentageType, SourceDataType, TableDataType, QuarterEarning } from "./types";

/**
 * Example of how a tableData object should be structured.
 *
 * Each `row` object has the following properties:
 * @prop {string} person - The full name of the employee.
 * @prop {number} past12Months - The value for the past 12 months.
 * @prop {number} y2d - The year-to-date value.
 * @prop {number} may - The value for May.
 * @prop {number} june - The value for June.
 * @prop {number} july - The value for July.
 * @prop {number} netEarningsPrevMonth - The net earnings for the previous month.
 */

const tableData: TableDataType[] = (
  sourceData as unknown as SourceDataType[]
).flatMap((dataRow) => {
  const isEmployee = !!dataRow.employees;
  const isExternal = !!dataRow.externals;

  if ((!isEmployee && !isExternal) ||
    (isEmployee && dataRow.employees?.status !== "active") ||
    (isExternal && dataRow.externals?.status !== "active")) {
    return [];
  }

  let firstName = "";
  let lastName = "";

  if (isEmployee) {
    firstName = dataRow.employees?.firstname || "";
    lastName = dataRow.employees?.lastname || "";
  } else if (isExternal) {
    firstName = dataRow.externals?.firstname || "";
    lastName = dataRow.externals?.lastname || "";
  }

  const person = isExternal
    ? `${firstName} ${lastName} (External)`
    : `${firstName} ${lastName}`;

  const utilisationData = isEmployee
    ? dataRow.employees?.workforceUtilisation
    : dataRow.externals?.workforceUtilisation;

  const lastThreeMonths = utilisationData?.lastThreeMonthsIndividually || [];

  const juneData = lastThreeMonths.find(month => month.month === "June");
  const julyData = lastThreeMonths.find(month => month.month === "July");
  const augustData = lastThreeMonths.find(month => month.month === "August");

  const formatPercentage = (value: PercentageType) => {
    if (!value && value !== "0")
      return "—";
    return `${(parseFloat(String(value)) * 100).toFixed(0)}%`;
  };

  const formatMoney = (value: string | number): string => {
    const numValue = parseFloat(String(value));
    if (isNaN(numValue) || Math.abs(numValue) < 0.01) {
      return "0 EUR";
    }
    if (isExternal) {
      return `-${Math.abs(numValue).toFixed(0)} EUR`;
    }
    return `${numValue.toFixed(0)} EUR`;
  };

  let netEarnings;

  if (isEmployee) {
    const q3Earnings = (utilisationData as any)?.quarterEarnings?.find((q: QuarterEarning) => q.name === "Q3")?.earnings;
    netEarnings = q3Earnings || "0";
  } else {
    netEarnings = ((dataRow.externals as any)?.monthlyCost || "0");
  }

  const formattedNetEarnings = formatMoney(netEarnings);

  const row: TableDataType = {
    person,
    past12Months: formatPercentage(utilisationData?.utilisationRateLastTwelveMonths),
    y2d: formatPercentage(utilisationData?.utilisationRateYearToDate),
    june: formatPercentage(juneData?.utilisationRate),
    july: formatPercentage(julyData?.utilisationRate),
    august: formatPercentage(augustData?.utilisationRate),
    netEarningsPrevMonth: formattedNetEarnings,
  };

  return [row];
});

const Example = () => {

  const columns = useMemo<MRT_ColumnDef<TableDataType>[]>(
    () => [
      {
        accessorKey: "person",
        header: "Person",
      },
      {
        accessorKey: "past12Months",
        header: "Past 12 Months",
        Cell: ({ cell }) => {
          const value = cell.getValue() as string;
          if (value === "—") return <span style={{ color: '#888' }}>{value}</span>;
          
          const percentage = parseInt(value.replace('%', ''));
          let color = percentage < 70 ? '#e53935' : percentage > 90 ? '#43a047' : '#fb8c00';
          
          return <span style={{ color, fontWeight: percentage > 90 ? 'bold' : 'normal' }}>{value}</span>;
        }
      },
      {
        accessorKey: "y2d",
        header: "Y2D",
        Cell: ({ cell }) => {
          const value = cell.getValue() as string;
          if (value === "—") return <span style={{ color: '#888' }}>{value}</span>;
          
          const percentage = parseInt(value.replace('%', ''));
          let color = percentage < 70 ? '#e53935' : percentage > 90 ? '#43a047' : '#fb8c00';
          
          return <span style={{ color, fontWeight: percentage > 90 ? 'bold' : 'normal' }}>{value}</span>;
        }
      },
      {
        accessorKey: "june",
        header: "June",
        Cell: ({ cell }) => {
          const value = cell.getValue() as string;
          if (value === "—") return <span style={{ color: '#888' }}>{value}</span>;
          
          const percentage = parseInt(value.replace('%', ''));
          let color = percentage < 70 ? '#e53935' : percentage > 90 ? '#43a047' : '#fb8c00';
          
          return <span style={{ color, fontWeight: percentage > 90 ? 'bold' : 'normal' }}>{value}</span>;
        }
      },
      {
        accessorKey: "july",
        header: "July",
        Cell: ({ cell }) => {
          const value = cell.getValue() as string;
          if (value === "—") return <span style={{ color: '#888' }}>{value}</span>;
          
          const percentage = parseInt(value.replace('%', ''));
          let color = percentage < 70 ? '#e53935' : percentage > 90 ? '#43a047' : '#fb8c00';
          
          return <span style={{ color, fontWeight: percentage > 90 ? 'bold' : 'normal' }}>{value}</span>;
        }
      },
      {
        accessorKey: "august",
        header: "August",
        Cell: ({ cell }) => {
          const value = cell.getValue() as string;
          if (value === "—") return <span style={{ color: '#888' }}>{value}</span>;
          
          const percentage = parseInt(value.replace('%', ''));
          let color = percentage < 70 ? '#e53935' : percentage > 90 ? '#43a047' : '#fb8c00';
          
          return <span style={{ color, fontWeight: percentage > 90 ? 'bold' : 'normal' }}>{value}</span>;
        }
      },
      {
        accessorKey: "netEarningsPrevMonth",
        header: "Net Earnings Prev Month",
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: tableData,
  });

  return <MaterialReactTable table={table} />;
};

export default Example;
