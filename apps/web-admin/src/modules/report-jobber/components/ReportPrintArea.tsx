import React from "react";
import { useReportJobber } from "../context/useReportJobber";

export const ReportPrintArea = React.forwardRef<HTMLDivElement>(
  (props, ref) => {
    const {
      statsQuery: {
        data: statsData,
        isLoading: statsLoading,
        error: statsError,
      },
      tableQuery: {
        data: tableData,
        isLoading: tableLoading,
        error: tableError,
      },
    } = useReportJobber();

    if (statsLoading || tableLoading) return <p>Loading...</p>;
    if (statsError || tableError) return <p>Error loading report data</p>;

    return (
      <div ref={ref} className="p-6 bg-white text-black max-w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Jobber Report</h1>
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
                  Total Jobber: {statsData.total ?? 0}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-700 font-medium">
                  Verified Jobber: {statsData.verified ?? 0}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-700 font-medium">
                  Unverified Jobber: {statsData.notverified ?? 0}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Companies Table */}
        <div>
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">
            Companies Directory
          </h2>
          <div className="overflow-x-auto shadow-sm border rounded-lg">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-200">
                  <th className="p-4 text-left text-gray-700">Name</th>
                  <th className="p-4 text-left text-gray-700">Gender</th>
                  <th className="p-4 text-left text-gray-700">birthday</th>
                  <th className="p-4 text-left text-gray-700">nationality</th>
                  <th className="p-4 text-center text-gray-700">
                    Verification Status
                  </th>
                  <th className="p-4 text-left text-gray-700">Date Joined</th>
                </tr>
              </thead>
              <tbody>
                {tableData?.data.map((jobber, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 font-medium text-gray-900">
                      {jobber.firstName} {jobber.lastName}
                    </td>
                    <td className="p-4 text-gray-700">{jobber.gender}</td>
                    <td className="p-4 text-gray-700">
                      {" "}
                      {new Date(jobber.birthday).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="p-4 text-gray-700">
                      {jobber.nationality}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                          jobber.isVerify
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                      >
                        {jobber.isVerify ? "✓ Verified" : "✗ Unverified"}
                      </span>
                    </td>
                    <td className="p-4 text-gray-700">
                      {new Date(jobber.createdAt).toLocaleDateString("en-US", {
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
