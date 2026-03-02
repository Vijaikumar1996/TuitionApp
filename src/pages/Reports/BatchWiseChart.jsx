import Chart from "react-apexcharts";

export default function BatchWiseChart() {

    const series = [45000, 38000];

    const options = {
        chart: {
            type: "donut",
            toolbar: { show: false },
        },
        labels: ["8th Morning 2026", "9th Evening 2026"],
        dataLabels: {
            enabled: false,
        },
        legend: {
            position: "bottom",
        },
        plotOptions: {
            pie: {
                donut: {
                    size: "65%",
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: "Total",
                            formatter: function () {
                                return "₹ 83000";
                            },
                        },
                    },
                },
            },
        },
        colors: ["#3B82F6", "#10B981"],
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-4">
                Batch-wise Collection
            </h3>

            <Chart
                options={options}
                series={series}
                type="donut"
                height={200}
            />
        </div>
    );
}