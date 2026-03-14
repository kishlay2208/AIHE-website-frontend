import { Award, Download, Eye, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCertificates } from "@/services/queries";

export default function Certificates() {
  const { data: certificatesData, isLoading } = useCertificates();
  const certificates = certificatesData?.data ?? [];
  const apiBase = import.meta.env.VITE_API_BASE_URL || "";
  const token = typeof localStorage !== "undefined" ? localStorage.getItem("auth_token") : null;
  const previewUrl = (id: number, download?: boolean) =>
    `${apiBase}/students/certificates/${id}/preview${download ? "?download=1" : ""}`;
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Certificates</h2>
        <p className="text-muted-foreground">View and download your earned certificates.</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading certificates...</div>
      ) : certificates.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No certificates available.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert: any) => (
          <Card key={cert.id} className="overflow-hidden">
            {/* Certificate Preview */}
            <div className="aspect-[4/3] bg-gradient-to-br from-muted to-muted/50 relative flex items-center justify-center">
              {cert.status === "available" ? (
                <div className="text-center p-8">
                  <div className="border-4 border-primary/20 rounded-lg p-6 bg-card/80 backdrop-blur">
                    <Award className="h-16 w-16 text-primary mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-foreground">Certificate of Completion</h3>
                    <p className="text-primary font-semibold mt-2">{cert.courseTitle}</p>
                    <p className="text-sm text-muted-foreground mt-4">
                      Verification ID: {cert.certificateNumber ?? cert.certificate_number ?? cert.id}
                    </p>
                  </div>
                  {/* Watermark */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                    <span className="text-6xl font-bold text-foreground rotate-[-30deg]">
                      PREVIEW
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8">
                  <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Certificate Pending</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Complete the course to unlock
                  </p>
                </div>
              )}
            </div>

            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-foreground">{cert.courseTitle}</h4>
                <Badge variant={cert.status === "available" ? "default" : "secondary"}>
                  {cert.status === "available" ? "Available" : "Pending"}
                </Badge>
              </div>

              {cert.status === "available" && (
                <>
                  <p className="text-sm text-muted-foreground mb-2">
                    Issued: {cert.issueDate ?? cert.issue_date ?? ""}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Verification ID: {cert.certificateNumber ?? cert.certificate_number ?? cert.id}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                      asChild
                    >
                      <a
                        href={previewUrl(cert.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          if (token) {
                            e.preventDefault();
                            const url = previewUrl(cert.id);
                            const w = window.open("", "_blank");
                            if (w) {
                              fetch(url, { headers: { Authorization: `Bearer ${token}` } })
                                .then((r) => r.text())
                                .then((html) => {
                                  w.document.write(html);
                                  w.document.close();
                                });
                            }
                          }
                        }}
                      >
                        <Eye className="h-4 w-4" />
                        Preview
                      </a>
                    </Button>
                    <Button size="sm" className="flex-1 gap-2" asChild>
                      <a
                        href={previewUrl(cert.id, true)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          if (token) {
                            e.preventDefault();
                            fetch(previewUrl(cert.id, true), { headers: { Authorization: `Bearer ${token}` } })
                              .then((r) => r.text())
                              .then((html) => {
                                const blob = new Blob([html], { type: "text/html" });
                                const a = document.createElement("a");
                                a.href = URL.createObjectURL(blob);
                                a.download = `certificate-${cert.id}.html`;
                                a.click();
                                URL.revokeObjectURL(a.href);
                              })
                              .catch(() => {});
                          }
                        }}
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </a>
                    </Button>
                  </div>
                </>
              )}

              {cert.status === "pending" && (
                <p className="text-sm text-muted-foreground">
                  Complete all assessments to receive your certificate.
                </p>
              )}
            </CardContent>
          </Card>
          ))}
        </div>
      )}
    </div>
  );
}
