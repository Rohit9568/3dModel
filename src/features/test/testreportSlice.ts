import ApiHelper from "../../utilities/ApiHelper";

export function updateTestReportMarks(data: {
  id: string;
  fileName: string;
  url: string;
  totalMarks: number;
}) {
  return ApiHelper.put(`/api/v1/testReport/updateMarks/${data.id}`, {
    pdfUrl: data.url,
    marks: data.totalMarks,
    filename: data.fileName,
  });
}
