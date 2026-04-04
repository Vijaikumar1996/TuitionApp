import { useNavigate } from "react-router";

export default function BatchPending({ data }) {
    const navigate = useNavigate();

    const total = data?.reduce((sum, b) => sum + b.Amount, 0) || 0;

    return (
        <div className="bg-white p-5 rounded-xl shadow h-[270px]">
            <h3 className="text-lg font-semibold mb-4">
                Batch-wise Pending
            </h3>

            <div className="space-y-3 max-h-[180px] overflow-y-auto pr-2">

                {/* ✅ No Data Case */}
                {!data || data.length === 0 ? (
                    <div className="flex items-center justify-center h-[150px] text-gray-400 text-sm">
                        No data found
                    </div>
                ) : (
                    data.map((b, index) => (
                        <div
                            key={index}
                            onClick={() =>
                                navigate("/fees", {
                                    state: {
                                        batchId: b.BatchId,
                                        batchName: b.Batch,
                                    },
                                })
                            }
                            className="cursor-pointer hover:bg-gray-50 p-2 rounded transition"
                        >
                            <div className="flex justify-between text-sm font-medium">
                                <span>{b.Batch}</span>
                                <span className="text-red-600">₹{b.Amount}</span>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full bg-gray-200 h-2 rounded mt-1">
                                <div
                                    className="bg-red-500 h-2 rounded"
                                    style={{
                                        width: `${total ? (b.Amount / total) * 100 : 0}%`,
                                    }}
                                />
                            </div>
                        </div>
                    ))
                )}

            </div>
        </div>
    );
}