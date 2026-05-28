import { useMemo, useState } from "react";

export default function App() {
  const [amount, setAmount] = useState("");
  const [vatRate, setVatRate] = useState("5");
  const [feeRate, setFeeRate] = useState("0");
  const [mode, setMode] = useState("add");

 const result = useMemo(() => {
  const value = parseFloat(amount) || 0;
  const vatPercent = parseFloat(vatRate) || 0;
  const feePercent = parseFloat(feeRate) || 0;

  if (mode === "add") {
    // Base fee
    const feeBase = (value * feePercent) / 100;

    // VAT on amount + fee
    const vatBase = value + feeBase;
    const vat = (vatBase * vatPercent) / 100;

    // VAT portion related only to fee
    const feeVat = (feeBase * vatPercent) / 100;

    // Fee shown including VAT
    const feeIncludingVat = feeBase + feeVat;

    const total = value + feeIncludingVat + vat;

    return {
      net: value.toFixed(2),
      fee: feeIncludingVat.toFixed(2),
      vat: vat.toFixed(2),
      total: total.toFixed(2),
    };
  }

  // Extract mode
  const feeMultiplier = 1 + feePercent / 100;
  const vatMultiplier = 1 + vatPercent / 100;

  const net = value / (feeMultiplier * vatMultiplier);

  const feeBase = net * (feePercent / 100);

  const vatBase = net + feeBase;
  const vat = vatBase * (vatPercent / 100);

  const feeVat = feeBase * (vatPercent / 100);
  const feeIncludingVat = feeBase + feeVat;

  return {
    net: net.toFixed(2),
    fee: feeIncludingVat.toFixed(2),
    vat: vat.toFixed(2),
    total: value.toFixed(2),
  };
}, [amount, vatRate, feeRate, mode]);
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>VAT + Fee Calculator</h1>

        <div style={styles.field}>
          <label>Amount</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label>VAT Rate (%)</label>
          <input
            type="number"
            placeholder="VAT %"
            value={vatRate}
            onChange={(e) => setVatRate(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label>Fee Rate (%)</label>
          <input
            type="number"
            placeholder="Fee %"
            value={feeRate}
            onChange={(e) => setFeeRate(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.buttons}>
          <button
            onClick={() => setMode("add")}
            style={{
              ...styles.button,
              ...(mode === "add" ? styles.activeButton : {}),
            }}
          >
            Add Charges
          </button>

          <button
            onClick={() => setMode("extract")}
            style={{
              ...styles.button,
              ...(mode === "extract" ? styles.activeButton : {}),
            }}
          >
            Extract Charges
          </button>
        </div>

        <div style={styles.resultBox}>
  <div style={styles.row}>
    <span>Net Amount:</span>
    <strong>{result.net}</strong>
  </div>

  <div style={styles.row}>
    <span>Fee (Incl. VAT):</span>
    <strong>{result.fee}</strong>
  </div>

  <div style={styles.totalRow}>
    <span>Total:</span>
    <strong>{result.total}</strong>
  </div>
</div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f3f4f6",
    fontFamily: "Arial, sans-serif",
    padding: 20,
  },

  card: {
    width: 420,
    background: "#fff",
    padding: 30,
    borderRadius: 16,
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  },

   title: {
    textAlign: "center",
    marginBottom: 24,
    whiteSpace: "nowrap",   // 
    fontSize: "clamp(18px, 4vw, 28px)",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    marginBottom: 18,
  },

  input: {
    padding: 12,
    marginTop: 8,
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 16,
  },

  buttons: {
    display: "flex",
    gap: 10,
    marginBottom: 24,
  },

  button: {
    flex: 1,
    padding: 12,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    background: "#e5e7eb",
    fontWeight: "bold",
  },

  activeButton: {
    background: "#2563eb",
    color: "#fff",
  },

  resultBox: {
    background: "#f9fafb",
    padding: 20,
    borderRadius: 12,
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    borderTop: "1px solid #ddd",
    paddingTop: 12,
    fontSize: 18,
  },
};