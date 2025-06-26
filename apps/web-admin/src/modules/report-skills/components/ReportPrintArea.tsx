import React from "react";
import { useReportSkill } from "../context/useReportSkills";

export const ReportPrintArea = React.forwardRef<HTMLDivElement>(
  (props, ref) => {
    const {
      statsQuery: {
        data: statusData,
        isLoading: statsLoading,
        error: statsError,
      },
      tableQuery: {
        data: tableData,
        isLoading: tableLoading,
        error: tableError,
      },
    } = useReportSkill();

    if (statsLoading || tableLoading) return <p>Loading...</p>;
    if (statsError || tableError) return <p>Error loading report data</p>;

    return (
      <div ref={ref} className="p-6 bg-white text-black max-w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Skills Report</h1>
          <p className="text-gray-600">
            Generated on {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Stats Summary */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">
            Summary Statistics
          </h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-gray-700 font-medium">
                  Total Skills: {statusData?.total ?? 0}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-700 font-medium">
                  Active Skills: {statusData?.active ?? 0}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Companies Table */}
        <div>
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">
            Skills Directory
          </h2>
          <div className="overflow-x-auto shadow-sm border rounded-lg">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-200">
                  <th className="p-4 text-left text-gray-700">No</th>
                  <th className="p-4 text-left text-gray-700">Skill Name</th>
                  <th className="p-4 text-left text-gray-700">
                    Jobber Usage Count
                  </th>
                  <th className="p-4 text-center text-gray-700">
                    Date Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData?.data.map((skills, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 font-medium text-gray-900">
                      {idx + 1}
                    </td>
                    <td className="p-4 font-medium text-gray-900">
                      {skills.name}
                    </td>
                    <td className="p-4 text-gray-700">
                      {skills.jobberUsageCount}
                    </td>
                    <td className="p-4 text-gray-700">
                      {new Date(skills.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {(!tableData?.data || tableData.data.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <p>No companies found in the database.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>End of Report</p>
        </div>
      </div>
    );
  }
);
