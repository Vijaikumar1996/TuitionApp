
export default function BatchPending({ data }) {
    // 🔥 Static data (for now)


    const total = data.reduce((sum, b) => sum + b.Amount, 0);

    return (
        <div className="bg-white p-5 rounded-xl shadow h-[270px]">
            <h3 className="text-lg font-semibold mb-4">
                Batch-wise Pending
            </h3>

            <div className="space-y-3 max-h-[180px] overflow-y-auto pr-2">
                {data.map((b, index) => (
                    <div key={index}>
                        <div className="flex justify-between text-sm font-medium">
                            <span>{b.Batch}</span>
                            <span className="text-red-600">₹{b.Amount}</span>
                        </div>

                        {/* 🔥 Progress bar */}
                        <div className="w-full bg-gray-200 h-2 rounded mt-1">
                            <div
                                className="bg-red-500 h-2 rounded"
                                style={{
                                    width: `${(b.Amount / total) * 100}%`,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
