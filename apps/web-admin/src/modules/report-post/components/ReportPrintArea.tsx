import React from "react";
import { useReportPost } from "../context/useReportPost";
import { formatTime } from "@/utils/formatDateTime";
import { Clock } from "lucide-react";
import { Badge } from "@skillsmatch/ui";

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
    } = useReportPost();

    if (statsLoading || tableLoading) return <p>Loading...</p>;
    if (statsError || tableError) return <p>Error loading report data</p>;

    return (
      <div ref={ref} className="p-6 bg-white text-black max-w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Post Report</h1>
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
                  Total Post: {statusData?.totalPosts ?? 0}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-700 font-medium">
                  Active Skills: {statusData?.activePosts ?? 0}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-700 font-medium">
                  Companies: {statusData?.uniqueCompanies ?? 0}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-700 font-medium">
                  Positions: {statusData?.totalPositions ?? 0}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-700 font-medium">
                  Avg. Salary: {statusData?.averageSalary ?? 0} THB average
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-700 font-medium">
                  Avg. GPA: {statusData?.expiredPosts ?? 0}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Companies Table */}
        <div>
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">
            Posts Directory
          </h2>
          <div className="overflow-x-auto shadow-sm border rounded-lg">
            <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-200">
                  <th className="p-4 text-left text-gray-700">Company Name</th>
                  <th className="p-4 text-left text-gray-700">Owner Name</th>
                  <th className="p-4 text-left text-gray-700">
                    Salary & Schedule
                  </th>
                  <th className="p-4 text-left text-gray-700">
                    Positions & Skills
                  </th>
                  <th className="p-4 text-center text-gray-700">End Date</th>
                  <th className="p-4 text-center text-gray-700">Joined</th>
                </tr>
              </thead>
              <tbody>
                {tableData?.data.map((data, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 font-medium text-gray-900">
                      {data.title}
                    </td>
                    <td className="p-4 font-medium text-gray-900">
                      {data.company.name}
                    </td>
                    <td className="p-4 text-gray-700">
                      <div className="font-medium" style={{fontSize:"14px"}}>
                        {data.currency} {data.minSalary.toLocaleString()} -{" "}
                        {data.maxSalary.toLocaleString()}
                      </div>
                      <div className="flex items-center text-muted-foreground text-[5px]" style={{fontSize:"12px"}}>
                        {formatTime(data.checkInTime)} -{" "}
                        {formatTime(data.checkOutTime)}
                      </div>
                    </td>
                    <td className="p-4 font-medium text-gray-900">
                      {data.postJobPositionDetail.length > 0 ? (
                        <div className="space-y-1">
                          {data.postJobPositionDetail
                            .slice(0, 2)
                            .map((position, index) => (
                              <div key={index} className="text-sm">
                                <div className="font-medium truncate">
                                  {position.jp.name}
                                </div>
                                <div className="text-muted-foreground text-xs">
                                  {position?.PostJobPositionDetailSkill
                                    ?.length ?? 0}{" "}
                                  skills
                                </div>
                              </div>
                            ))}
                          {data.postJobPositionDetail.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{data.postJobPositionDetail.length - 2} more
                              positions
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          No positions
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-gray-700">
                      <div
                        className={
                          new Date(data.endDate) < new Date()
                            ? "text-red-600"
                            : ""
                        }
                      >
                        {new Date(data.endDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      {new Date(data.endDate) < new Date() && (
                        <Badge variant="destructive" className="text-xs">
                          Expired
                        </Badge>
                      )}
                    </td>
                    <td className="p-4 text-gray-700">
                      {new Date(data.createdAt).toLocaleDateString("en-US", {
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
