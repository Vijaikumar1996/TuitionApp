import DashboardMetrics from "../../components/dashboard/DashboardMetrics";
import MonthlySalesChart from "../../components/dashboard/MonthlySalesChart";
import RecentOrders from "../../components/dashboard/RecentOrders";
import PageMeta from "../../components/common/PageMeta";
import RecentPayments from "../../components/dashboard/RecentPayment";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Tution App"
        description="This is React.js Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-12">
          <DashboardMetrics />


        </div>

        {/* <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div> */}

        <div className="col-span-12 xl:col-span-6">
          <MonthlySalesChart />
          {/* <StatisticsChart /> */}
        </div>

        {/* <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div> */}

        <div className="col-span-12 xl:col-span-6">
          <RecentPayments />
        </div>
      </div>
    </>
  );
}
