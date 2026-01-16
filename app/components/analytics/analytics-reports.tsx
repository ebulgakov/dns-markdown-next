"use client";
import ReactMarkdown from "react-markdown";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { formatDateShort } from "@/app/helpers/format";

import styles from "./analytics-reports.module.css";

import type { ReportsResponse } from "@/types/reports";

type AnalyticsReportsProps = {
  reports: ReportsResponse;
};

function AnalyticsReports({ reports }: AnalyticsReportsProps) {
  if (!reports || reports.length === 0) return null;

  return (
    <Tabs defaultValue={reports[0].dateAdded}>
      <TabsList className="flex w-full flex-1 flex-col items-stretch md:flex-auto md:flex-row md:items-center">
        {reports.map(report => (
          <TabsTrigger key={report.dateAdded} value={report.dateAdded}>
            {formatDateShort(report.dateAdded)}
          </TabsTrigger>
        ))}
      </TabsList>

      <div className={styles.wrapper}>
        {reports.map(report => (
          <TabsContent key={report.dateAdded} value={report.dateAdded}>
            <ReactMarkdown>{report.report}</ReactMarkdown>
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
}

export { AnalyticsReports };
