import ProgressBar from "components/ProgressBar/ProgressBar";
import React from "react";

// components

export default function BasicTable({stripped, hover}) {
  const columns = [{
    title: 'Referral',
    key: 'referral',
    className: 'font-bold'
  },
  {
    title: 'Visitors',
    key:'visitors',
    formatter: (value) => value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
  },
  {
    key: 'percentage',
    className: 'min-w-140-px',
    formatter: ({value, color}) => <ProgressBar value={value} animation color={color} rounded text='left' size="xs"></ProgressBar>
  }]
  const values = [
    {
      referral: 'Facebook',
      visitors: '1400',
      percentage: {
        value: 50, color: 'red'
      }
    },
    {
      referral: 'Facebook',
      visitors: '5480',
      percentage: {
        value: 70, color: 'emerald'
      }
    },
    {
      referral: 'Google',
      visitors: '1807',
      percentage: {
        value: 80, color: 'purple'
      }
    },
    {
      referral: 'Instagram',
      visitors: '3678',
      percentage: {
        value: 75, color: 'sky'
      }
    },
    {
      referral: 'Twitter',
      visitors: '2645',
      percentage: {
        value: 30, color: 'orange'
      }
    },
  ]
  return (
    <>
      <div className="block w-full overflow-x-auto text-left">
        <table className="items-center w-full bg-transparent border-collapse">
          <thead className="thead-light">
            <tr>
              {
              columns.map(column => 
                <th className={`px-4 bg-slate-200 text-slate-600 align-middle border border-solid border-slate-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold`}>
                  {column.title}
                </th>
                )
              }
            </tr>
          </thead>
          <tbody>
            {values.map((line, index) => 
              <tr className={`${stripped && index % 2 != 0 ? 'bg-slate-100' : 'bg-white'} ${hover ? 'hover:bg-slate-200' : ''}`}>
                {columns.map(({key, formatter, className}) => 
                  <td className={`border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ${className}`}>
                    {formatter ? formatter(line[key]) : line[key]}
                  </td>
                )}
              </tr>
              )
            }
          </tbody>
        </table>
      </div>
    </>
  );
}
