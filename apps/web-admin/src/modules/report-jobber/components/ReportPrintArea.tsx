import React from "react";
import { useReportJobber } from "../context/useReportJobber";
import { calculateAge } from "@/utils/extractChangedFields";
import { FullImageViewer } from "@skillsmatch/ui";

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
      <div
        ref={ref}
        style={{
          padding: "24px",
          backgroundColor: "white",
          color: "black",
          maxWidth: "100%",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            Jobber Report
          </h1>
          <p style={{ color: "#4B5563" }}>
            Generated on {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Stats Summary */}
        <div>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "8px",
              borderBottom: "1px solid #E5E7EB",
            }}
          >
            Summary Statistics
          </h2>
          <div
            style={{
              backgroundColor: "#F9FAFB",
              padding: "8px",
              borderRadius: "8px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "24px",
                textAlign: "center",
              }}
            >
              <div>
                <div style={{ color: "#374151", fontWeight: "500" }}>
                  Total Jobber: {statsData.total ?? 0}
                </div>
              </div>
              <div>
                <div style={{ color: "#374151", fontWeight: "500" }}>
                  Verified Jobber: {statsData.verified ?? 0}
                </div>
              </div>
              <div>
                <div style={{ color: "#374151", fontWeight: "500" }}>
                  Unverified Jobber: {statsData.notverified ?? 0}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Jobber Profiles */}
        <div>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "8px",
              paddingBottom: "4px",
              borderBottom: "1px solid #E5E7EB",
            }}
          >
            Jobber Profiles
          </h2>
          <div>
            {tableData?.data.map((data, idx) => (
              <div
                key={idx}
                style={{
                  border: "1px solid #D1D5DB",
                  borderRadius: "8px",
                  padding: "6px",
                  fontSize: "14px",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                    gap: "16px",
                    alignItems: "start",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <FullImageViewer
                      width={90}
                      height={90}
                      src={data.member?.profile || "/placeholder.svg"}
                      alt={`${data.firstName} ${data.lastName}`}
                      className="rounded object-cover"
                    />
                  </div>
                  <div
                    style={{
                      paddingLeft: "8px",
                      borderLeft: "1px solid #E5E7EB",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "8px",
                      }}
                    >
                      <div>
                        {data.firstName} {data.lastName},{" "}
                        {calculateAge(data.birthday)}
                      </div>
                    </div>
                    <div>Email: {data.member?.username || "-"}</div>
                    <div>ເບີໂທ: {data.member?.phoneNumber || "-"}</div>
                    <div>{data.isActive ? "ກຳລັງຫາວຽກ" : "ບໍ່ໄດ້ຫາວຽກ"}</div>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    alignItems: "center",
                    gap: "8px",
                    paddingBottom: "8px",
                    borderBottom: "1px solid #E5E7EB",
                    marginTop: "12px",
                  }}
                >
                  <div style={{ fontWeight: "600" }}>ທີ່ຢູ່ປັດຈຸບັນ</div>
                  <div>ບ້ານ: {data.cVillage || "-"}</div>
                  <div>ເມືອງ: {data.cDistrict || "-"}</div>
                  <div>ແຂວງ: {data.cProvince || "-"}</div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    alignItems: "center",
                    gap: "8px",
                    marginTop: "8px",
                  }}
                >
                  <div style={{ fontWeight: "600" }}>ບ້ານເກີດ</div>
                  <div>ບ້ານ: {data.bVillage || "-"}</div>
                  <div>ເມືອງ: {data.bDistrict || "-"}</div>
                  <div>ແຂວງ: {data.bProvince || "-"}</div>
                </div>

                {/* Educational Details */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    alignItems: "center",
                    gap: "8px",
                    marginTop: "8px",
                  }}
                >
                  <div style={{ fontWeight: "600" }}>ຂໍ້ມູນນັກສຶກສາ</div>
                  <div>ສະຖາບັນ: </div>
                  <div>
                    {data.JobberProfile?.educationalInstitutions?.name || "-"}
                  </div>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "8px",
                  }}
                >
                  <div></div>
                  <div>ລະດັບ: </div>
                  <div>{data.JobberProfile?.educationLevels?.name || "-"}</div>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "8px",
                  }}
                >
                  <div></div>
                  <div>ຄະນະ: </div>
                  <div>{data.JobberProfile?.major?.name || "-"}</div>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "8px",
                  }}
                >
                  <div></div>
                  <div>ສາຂາ: </div>
                  <div>{data.JobberProfile?.course?.name || "-"}</div>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "8px",
                  }}
                >
                  <div></div>
                  <div>GPA: </div>
                  <div>{data.JobberProfile?.gpa || "-"}</div>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "8px",
                  }}
                >
                  <div></div>
                  <div>ເງິນເດືອນເລີ່ມຕົ້ນ: </div>
                  <div>{data.JobberProfile?.startSalary || "-"}</div>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "8px",
                  }}
                >
                  <div></div>
                  <div>ເວລາເຮັດວຽກ: </div>
                  <div>
                    {(data.JobberProfile?.checkInTime || "N/A") +
                      " - " +
                      (data.JobberProfile?.checkOutTime || "N/A")}
                  </div>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "8px",
                    borderBottom: "1px solid #E5E7EB",
                  }}
                >
                  <div></div>
                  <div>ວັນເຮັດວຽກ: </div>
                  <div>
                    {Array.isArray(data.JobberProfile?.workDay) &&
                    data.JobberProfile.workDay.length > 0
                      ? data.JobberProfile.workDay.join(", ")
                      : "-"}
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "8px",
                    borderBottom: "1px solid #E5E7EB",
                    marginTop: "8px",
                  }}
                >
                  <div style={{ fontWeight: "600" }}>ຕຳແໜ່ງທີ່ສົນໃຈ</div>
                  <div>
                    {Array.isArray(data.ApplyForJob) &&
                    data.ApplyForJob.length > 0
                      ? data.ApplyForJob.map((item) => item.jp).join(", ")
                      : "-"}
                  </div>
                </div>

                {/* Skills */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "8px",
                    marginTop: "8px",
                  }}
                >
                  <div style={{ fontWeight: "600" }}>ທັກສະ</div>
                  <div>
                    {data?.JobberProfile?.JobberProfileSkill?.length > 0
                      ? data.JobberProfile.JobberProfileSkill.map(
                          (item) => item?.skill?.name ?? ""
                        )
                          .filter((name) => name !== "")
                          .join(", ")
                      : "-"}
                  </div>
                </div>
              </div>
            ))}

            {(!tableData?.data || tableData.data.length === 0) && (
              <div
                style={{
                  textAlign: "center",
                  padding: "32px 0",
                  color: "#6B7280",
                }}
              >
                <p>No jobbers found in the database.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "32px",
            textAlign: "center",
            fontSize: "14px",
            color: "#6B7280",
          }}
        >
          <p>End of Report</p>
        </div>
      </div>
    );
  }
);
