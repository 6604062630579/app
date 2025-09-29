import { useState } from "react";
import { evaluate } from "mathjs";

export default function App() {
  const [expr, setExpr] = useState("");
  const [x1, setX1] = useState();
  const [x2, setX2] = useState();
  const [epsilon, setEpsilon] = useState(0.000001);
  const [result, setResult] = useState(null);

  function bisection(expr, xl, xr, eps) {
    if (evaluate(expr, { x: xl }) * evaluate(expr, { x: xr }) > 0) {
      return { error: "Try another equation" };
    }

    let xm = (xl + xr) / 2;
    let criterion = Infinity;
    let log = [];
    let i = 0;

    while (criterion > eps && i < 1000) {
      let fxm = evaluate(expr, { x: xm });
      let fxr = evaluate(expr, { x: xr });

      if (fxm * fxr < 0) {
        xl = xm;
      } else {
        xr = xm;
      }

      let xmnew = (xl + xr) / 2;
      criterion = Math.abs((xmnew - xm) / xmnew);

      log.push({ iteration: i + 1, xm: xmnew, error: criterion });

      xm = xmnew;
      i++;
    }

    return { iterations: i, result: xm, log };
  }

  const handleCalculate = (e) => {
    e.preventDefault();
    setResult(null);

    try {
      const xl = Number(x1);
      const xr = Number(x2);
      const eps = Number(epsilon);

      const summary = bisection(expr, xl, xr, eps);

      if (summary?.error) {
        setResult({ error: summary.error });
      } else {
        setResult(summary);
      }
    } catch {
      setResult({ error: "สมการผิด" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-6 text-center text-pink-600">
          Bisection Method
        </h1>

        <form onSubmit={handleCalculate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">f(x)</label>
              <input
                type="text"
                value={expr}
                onChange={(e) => setExpr(e.target.value)}
                className="border rounded p-2 w-full focus:ring-2 focus:ring-pink-400"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">xl</label>
              <input
                type="number"
                value={x1}
                onChange={(e) => setX1(e.target.value)}
                className="border rounded p-2 w-full focus:ring-2 focus:ring-pink-400"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">xr</label>
              <input
                type="number"
                value={x2}
                onChange={(e) => setX2(e.target.value)}
                className="border rounded p-2 w-full focus:ring-2 focus:ring-pink-400"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">epsilon</label>
              <input
                type="number"
                step="0.000001"
                value={epsilon}
                onChange={(e) => setEpsilon(e.target.value)}
                className="border rounded p-2 w-full focus:ring-2 focus:ring-pink-400"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-pink-500 text-white font-semibold hover:bg-pink-600 px-4 py-2 rounded w-full"
          >
            Calculate
          </button>
        </form>

        {result && (
          <div className="mt-6">
            {result.error ? (
              <p className="text-red-500 font-medium">{result.error}</p>
            ) : (
              <>
                <p className="text-green-600 font-medium">
                  Root ≈ {result.result.toFixed(6)} (iterations:{" "}
                  {result.iterations})
                </p>

                <div className="overflow-x-auto mt-4">
                  <table className="min-w-full border border-gray-300 text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border p-2">Iteration</th>
                        <th className="border p-2">xm</th>
                        <th className="border p-2">Error</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.log.map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="border p-2 text-center">
                            {row.iteration}
                          </td>
                          <td className="border p-2">{row.xm.toFixed(6)}</td>
                          <td className="border p-2">
                            {row.error.toExponential(10)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
