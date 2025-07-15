import React from "react";
import { useReportPost } from "../context/useReportPost";
import { formatTime, formatTime2 } from "@/utils/formatDateTime";
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
      <div
        ref={ref}
        style={{
          padding: 24,
          backgroundColor: "white",
          color: "black",
          maxWidth: "100%",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1
            style={{
              fontSize: 24,
              fontWeight: "bold",
              marginBottom: 8,
            }}
          >
            Post Report
          </h1>
          <p style={{ color: "#718096" }}>
            Generated on {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Stats Summary */}
        <div style={{ marginBottom: 32 }}>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 600,
              marginBottom: 8,
              borderBottom: "1px solid #E5E7EB",
              paddingBottom: 4,
            }}
          >
            Summary Statistics
          </h2>
          <div
            style={{
              backgroundColor: "#F9FAFB",
              padding: 8,
              borderRadius: 8,
            }}
          >
            <div style={{ color: "#4a5568", fontWeight: 500 }}>
              Total Post: {statusData?.totalPosts ?? 0}
            </div>
            <div style={{ color: "#4a5568", fontWeight: 500 }}>
              Active Skills: {statusData?.activePosts ?? 0}
            </div>
            <div style={{ color: "#4a5568", fontWeight: 500 }}>
              Companies: {statusData?.uniqueCompanies ?? 0}
            </div>
            <div style={{ color: "#4a5568", fontWeight: 500 }}>
              Positions: {statusData?.totalPositions ?? 0}
            </div>
            <div style={{ color: "#4a5568", fontWeight: 500 }}>
              Avg. Salary: {statusData?.averageSalary ?? 0} THB average
            </div>
            <div style={{ color: "#4a5568", fontWeight: 500 }}>
              Avg. GPA: {statusData?.expiredPosts ?? 0}
            </div>
          </div>
        </div>

        {/* Posts Directory */}
        <div>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 600,
              marginBottom: 16,
              borderBottom: "1px solid #e2e8f0",
              paddingBottom: 8,
            }}
          >
            Posts Directory
          </h2>

          {tableData?.data.length ? (
            tableData.data.map((post, idx) => (
              <div
                key={idx}
                style={{
                  border: "2px solid #e2e8f0",
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 24,
                  width: "100%",
                  fontSize: 14,
                  color: "#1a202c",
                }}
              >
                {/* Header grid: company name + post title */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                    alignItems: "start",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "600",
                      paddingRight: 12,
                      height: "100%",
                    }}
                  >
                    <p style={{ margin: 0 }}>{post.company?.name ?? "-"}</p>
                    <p style={{ margin: 0 }}>/ {post.title}</p>
                  </div>

                  {/* Positions sub-table */}
                  <div
                    style={{
                      marginLeft: 12,
                      borderLeft: "1px solid #e2e8f0",
                      paddingLeft: 12,
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                    }}
                  >
                    {/* Positions Header */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        backgroundColor: "#e2e8f0",
                        padding: "4px 8px",
                        fontWeight: "600",
                        color: "#4a5568",
                        borderBottom: "1px solid #cbd5e1",
                        textAlign: "center",
                        fontSize: 14,
                      }}
                    >
                      <div>ຕຳແໜ່ງ</div>
                      <div>ຈຳນວນ</div>
                      <div>ທັກສະທີ່ຕ້ອງການ</div>
                    </div>

                    {/* Positions rows */}
                    {post.postJobPositionDetail?.length ? (
                      post.postJobPositionDetail.map((pos, i) => (
                        <div
                          key={i}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            padding: "4px 8px",
                            textAlign: "center",
                            fontSize: 13,
                            alignItems: "center",
                          }}
                        >
                          <div>{pos.jp?.name || "-"}</div>
                          <div>{pos.amount ?? "-"}</div>
                          <div
                            style={{
                              gridColumn: "3 / span 1",
                              textAlign: "left",
                              whiteSpace: "normal",
                            }}
                          >
                            {pos.PostJobPositionDetailSkill?.length
                              ? pos.PostJobPositionDetailSkill.map(
                                  (skill) => skill.jp?.name || "-"
                                ).join(", ")
                              : "-"}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div
                        style={{
                          padding: "8px",
                          textAlign: "center",
                          color: "#a0aec0",
                          fontStyle: "italic",
                        }}
                      >
                        No positions
                      </div>
                    )}
                  </div>
                </div>

                {/* Details Section */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 2fr", // ปรับจาก 1fr ทั้งหมดให้เหมาะกับข้อมูลจริง
                    alignItems: "center",
                    gap: "40px", // ลด gap ให้ balance มากขึ้น
                    paddingLeft: "24px",
                    marginTop: "8px",
                    fontSize: "14px",
                    color: "#1a202c",
                  }}
                >
                  <div style={{ fontWeight: 600 }}>ລາຍລະອຽດ:</div>
                  <div>ເງຶນເດືອນ:</div>
                  <div style={{ width: "100%", fontWeight: 500 }}>
                    {post.currency} {post.minSalary?.toLocaleString()} -{" "}
                    {post.maxSalary?.toLocaleString()}
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 2fr", // ปรับจาก 1fr ทั้งหมดให้เหมาะกับข้อมูลจริง
                    alignItems: "center",
                    gap: "40px", // ลด gap ให้ balance มากขึ้น
                    paddingLeft: "24px",
                    marginTop: "8px",
                    fontSize: "14px",
                    color: "#1a202c",
                  }}
                >
                  <div></div>
                  <div>ເວລາເຮັດວຽກ:</div>
                  <div>
                    {post.checkInTime} - {post.checkOutTime}
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 2fr", // ปรับจาก 1fr ทั้งหมดให้เหมาะกับข้อมูลจริง
                    alignItems: "center",
                    gap: "40px", // ลด gap ให้ balance มากขึ้น
                    paddingLeft: "24px",
                    marginTop: "8px",
                    fontSize: "14px",
                    color: "#1a202c",
                  }}
                >
                  <div></div>
                  <div>GPA ຂັ້ນຕ່ຳ:</div>
                  <div>{post.gpa ?? "-"}</div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 2fr", // ปรับจาก 1fr ทั้งหมดให้เหมาะกับข้อมูลจริง
                    alignItems: "center",
                    gap: "40px", // ลด gap ให้ balance มากขึ้น
                    paddingLeft: "24px",
                    marginTop: "8px",
                    fontSize: "14px",
                    color: "#1a202c",
                  }}
                >
                  <div></div>
                  <div>ວັນເຮັດວຽກ:</div>
                  <div>{post.workday?.join(", ") || "-"}</div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 2fr", // ปรับจาก 1fr ทั้งหมดให้เหมาะกับข้อมูลจริง
                    alignItems: "center",
                    gap: "40px", // ลด gap ให้ balance มากขึ้น
                    paddingLeft: "24px",
                    marginTop: "8px",
                    fontSize: "14px",
                    color: "#1a202c",
                  }}
                >
                  <div></div>
                  <div>ລະດັບການສຶກສາ:</div>
                  <div>
                    {post.postEducationLevel
                      ?.map((e) => e?.educationLevel?.name)
                      .join(", ") || "-"}
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 2fr", // ปรับจาก 1fr ทั้งหมดให้เหมาะกับข้อมูลจริง
                    alignItems: "center",
                    gap: "40px", // ลด gap ให้ balance มากขึ้น
                    paddingLeft: "24px",
                    marginTop: "8px",
                    fontSize: "14px",
                    color: "#1a202c",
                  }}
                >
                  <div></div>
                  <div>ສະຖາບັນ:</div>
                  <div>
                    {post.postEducationInstitution
                      ?.map((i) => i?.ei?.name)
                      .join(", ") || "-"}
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 2fr", // ปรับจาก 1fr ทั้งหมดให้เหมาะกับข้อมูลจริง
                    alignItems: "center",
                    gap: "40px", // ลด gap ให้ balance มากขึ้น
                    paddingLeft: "24px",
                    marginTop: "8px",
                    fontSize: "14px",
                    color: "#1a202c",
                  }}
                >
                  <div></div>
                  <div>ຫຼັກສູດ:</div>
                  <div>
                    {post.postCourse?.map((c) => c?.cr?.name).join(", ") || "-"}
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 2fr", // ปรับจาก 1fr ทั้งหมดให้เหมาะกับข้อมูลจริง
                    alignItems: "center",
                    gap: "40px", // ลด gap ให้ balance มากขึ้น
                    paddingLeft: "24px",
                    marginTop: "8px",
                    fontSize: "14px",
                    color: "#1a202c",
                  }}
                >
                  <div></div>
                  <div>ສະຫວັດດີການ:</div>
                  <div>{post.welfare || "-"}</div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 2fr", // ปรับจาก 1fr ทั้งหมดให้เหมาะกับข้อมูลจริง
                    alignItems: "center",
                    gap: "40px", // ลด gap ให้ balance มากขึ้น
                    paddingLeft: "24px",
                    marginTop: "8px",
                    fontSize: "14px",
                    color: "#1a202c",
                  }}
                >
                  <div></div>
                  <div>ລາຍລະອຽດເພີ່ມເຕີມ:</div>
                  <div>{post.more || "-"}</div>
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "20px",
              }}
            >
              No companies found in the database.
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: 32,
            textAlign: "center",
            fontSize: 14,
            color: "#a0aec0",
          }}
        >
          End of Report
        </div>
      </div>
    );
  }
);
