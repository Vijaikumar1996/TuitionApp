import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function PayFee({
    fee,
    onClose,
    onSubmit,
    loading,
}) {
    const [totalFee, setTotalFee] = useState(0);
    const [payment, setPayment] = useState(0);
    const [selectedOption, setSelectedOption] = useState("full");
    const [paymentMode, setPaymentMode] = useState("Cash");
    const [notes, setNotes] = useState("");

    useEffect(() => {
        if (fee) {
            setTotalFee(fee.Amount_Due);
            setPayment(0);
            setSelectedOption("full");
            setPaymentMode("Cash");
            setNotes("");
        }
    }, [fee]);

    if (!fee) return null;

    const alreadyPaid = fee.Amount_Paid;
    const balance = totalFee - alreadyPaid;

    const hasChanges =
        totalFee !== fee.Amount_Due || payment > 0;

    const handleSubmit = async () => {
        if (totalFee < alreadyPaid) {
            toast.error("Total fee cannot be less than already paid");
            return;
        }

        if (payment > balance) {
            toast.error("Payment exceeds balance");
            return;
        }

        await onSubmit({
            Id: fee.Id,
            NewAmount: totalFee,
            PaymentAmount: payment,
            PaymentMode: paymentMode,
            Notes: notes,
        });
    };

    // 🔥 Quick actions
    const handleFull = () => {
        const newFee = fee.Amount_Due;
        const newBalance = newFee - alreadyPaid;

        setTotalFee(newFee);
        setPayment(newBalance);
        setSelectedOption("full");
    };

    const handleHalf = () => {
        const newFee = Math.floor(fee.Amount_Due / 2);
        const newBalance = newFee - alreadyPaid;

        setTotalFee(newFee);
        setPayment(newBalance > 0 ? newBalance : 0);
        setSelectedOption("half");
    };

    const handleNoFee = () => {
        setTotalFee(alreadyPaid);
        setPayment(0);
        setSelectedOption("nofee");
    };

    const getBtnClass = (type) =>
        `px-3 py-1 rounded text-sm border ${selectedOption === type
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`;

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg w-[420px] max-h-[90vh] flex flex-col shadow">
                <div className="p-6 overflow-y-auto">
                    {/* Title */}
                    <h2 className="text-lg font-semibold mb-1">Pay Fee</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        {fee.Student_Name}
                    </p>

                    {/* Paid / Balance */}
                    <div className="mb-5 p-3 rounded bg-gray-50 text-sm flex justify-between">
                        <p>
                            Paid: <span className="text-green-600 font-medium">₹{alreadyPaid}</span>
                        </p>

                        <p>
                            Balance:{" "}
                            <span
                                className={`font-semibold ${balance > 0 ? "text-red-600" : "text-green-600"
                                    }`}
                            >
                                ₹{balance}
                            </span>
                        </p>
                    </div>

                    {/* Total Fee */}
                    <div className="mb-4">
                        <label className="text-sm font-medium">Total Fee</label>
                        <input
                            type="number"
                            value={totalFee}
                            onChange={(e) => {
                                setTotalFee(Number(e.target.value));
                                setSelectedOption(null);
                            }}
                            className="w-full border px-3 py-2 rounded mt-1"
                        />
                    </div>

                    {/* Quick Buttons */}
                    <div className="flex gap-2 mb-4">
                        <button onClick={handleFull} className={getBtnClass("full")}>Full</button>
                        <button onClick={handleHalf} className={getBtnClass("half")}>Half</button>
                        <button onClick={handleNoFee} className={getBtnClass("nofee")}>No Fee</button>
                    </div>

                    <div className="mb-4 grid grid-cols-2 gap-3">
                        {/* Payment Mode */}
                        <div>
                            <label className="text-sm font-medium">Mode</label>
                            <select
                                value={paymentMode}
                                onChange={(e) => setPaymentMode(e.target.value)}
                                className="w-full border px-3 py-2 rounded mt-1"
                            >
                                <option>Cash</option>
                                <option>UPI</option>
                                <option>Card</option>
                                <option>Bank Transfer</option>
                            </select>
                        </div>
                        {/* Payment Amount */}
                        <div>
                            <label className="text-sm font-medium">Paid Amount</label>
                            <div className="relative mt-1">
                                <span className="absolute left-3 top-2 text-gray-500">₹</span>
                                <input
                                    type="number"
                                    value={payment}
                                    onChange={(e) => setPayment(Number(e.target.value))}
                                    className="w-full border px-3 py-2 pl-7 rounded"
                                />
                            </div>
                        </div>



                    </div>

                    {/* 🔥 Notes */}
                    <div className="mb-5">
                        <label className="text-sm font-medium">Notes (optional)</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full border px-3 py-2 rounded mt-1"
                            rows={2}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2">
                        <button onClick={onClose} className="px-4 py-2 border rounded">
                            Cancel
                        </button>

                        <button
                            onClick={handleSubmit}
                            disabled={loading || !hasChanges}
                            className={`px-4 py-2 rounded text-white ${loading || !hasChanges
                                ? "bg-gray-400"
                                : "bg-blue-600 hover:bg-blue-700"
                                }`}
                        >
                            {loading ? "Processing..." : "Save & Pay"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}