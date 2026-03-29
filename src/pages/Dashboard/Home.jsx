import DashboardMetrics from "../../components/dashboard/DashboardMetrics";
import MonthlySalesChart from "../../components/dashboard/MonthlySalesChart";
import PageMeta from "../../components/common/PageMeta";
import BatchPending from "../../components/dashboard/BatchPending";

import { useDashboard } from "../../queries/useDashboard";

export default function Home() {
  const { data, isLoading } = useDashboard();
  return (
    <>
      <PageMeta
        title="Tution App"
        description="Dashboard"
      />



      <div className="grid grid-cols-12 gap-4 md:gap-6">

        {/* Metrics */}
        <div className="col-span-12">
          <DashboardMetrics data={data} />
        </div>

        {/* Chart */}
        {
          data?.MonthlyRevenue &&
          <div className="col-span-12 xl:col-span-6">
            <MonthlySalesChart data={data?.MonthlyRevenue} />
          </div>
        }


        {/* Recent Payments */}
        {/* <div className="col-span-12 xl:col-span-6">
          <RecentPayments />
        </div> */}

        {/* 🔥 NEW - Batch Pending */}
        {
          data?.BatchPending &&
          <div className="col-span-12 xl:col-span-6">
            <BatchPending data={data?.BatchPending} />
          </div>
        }


      </div>
    </>
  );

}
