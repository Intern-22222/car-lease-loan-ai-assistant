import { useState, useMemo } from "react";
import "./ContractComparison.css";
import { TERMINATION_LEVEL, MAINTENANCE_TYPE, WARRANTY_TYPE, AVAILABILITY_STATUS, PENALTY_LEVEL } from "../constants/enums";
import { RATING_FIELDS, getScoreColor, calculateTotalScore } from "../constants/ratingConfig";
import { FIELD_ORDER, validateContract, formatValue, getFieldLabel, areContractsDifferent, getSafeFieldValue } from "../utils/fieldMapping";
import { calculateContractRatings } from "../utils/ratingCalculator";
import { generateInsights } from "../utils/insightGenerator";

const contracts = [
  {
    id: "BMW001",
    name: "BMW Lease",
    aprPercent: 10,
    leaseTermMonths: 36,
    monthlyPaymentINR: 5700,
    downPaymentINR: 70000,
    residualValueINR: 400000,
    annualMileageKm: 15000,
    earlyTerminationLevel: TERMINATION_LEVEL.HIGH,
    purchaseOptionStatus: AVAILABILITY_STATUS.AVAILABLE,
    maintenanceType: MAINTENANCE_TYPE.DEALER,
    warrantyType: WARRANTY_TYPE.INCLUDED,
    penaltyLevel: PENALTY_LEVEL.HIGH
  },
  {
    id: "AUDI002",
    name: "Audi Lease",
    aprPercent: 7,
    leaseTermMonths: 48,
    monthlyPaymentINR: 6200,
    downPaymentINR: 60000,
    residualValueINR: 380000,
    annualMileageKm: 12000,
    earlyTerminationLevel: TERMINATION_LEVEL.MEDIUM,
    purchaseOptionStatus: AVAILABILITY_STATUS.NOT_AVAILABLE,
    maintenanceType: MAINTENANCE_TYPE.CUSTOMER,
    warrantyType: WARRANTY_TYPE.PARTIAL,
    penaltyLevel: PENALTY_LEVEL.MEDIUM
  }
];


/* ----------- COMPONENT ----------- */

const ScoreBanner = ({ left, right, leftScore, rightScore, winner }) => (
  <div className="section-block score-banner">
    <div className="score-container">
      <div className={`score-card ${winner === "left" ? "winner" : ""}`}>
        <div className="score-label">{left.name}</div>
        <div className={`score-value color-${getScoreColor(leftScore)}`}>{leftScore}/10</div>
        {leftScore !== rightScore && winner === "left" && <div className="vs-badge">✓ Better Value</div>}
      </div>
      {leftScore !== rightScore && <div className="vs-text">vs</div>}
      <div className={`score-card ${winner === "right" ? "winner" : ""}`}>
        <div className="score-label">{right.name}</div>
        <div className={`score-value color-${getScoreColor(rightScore)}`}>{rightScore}/10</div>
        {leftScore !== rightScore && winner === "right" && <div className="vs-badge">✓ Better Value</div>}
      </div>
    </div>
  </div>
);

const RatingsTable = ({ left, right, leftRatings, rightRatings }) => (
  <div className="section-block">
    <div className="section-title">Feature Ratings (0–10)</div>
    <table className="ratings-table">
      <thead><tr><th>Feature</th><th>{left.name}</th><th>{right.name}</th></tr></thead>
      <tbody>
        {RATING_FIELDS.map(({ label, key }) => (
          <tr key={label}>
            <td className="feature-label">{label}</td>
            <td><div className={`rating-circle ${getScoreColor(leftRatings[key] ?? 0)}`}>{leftRatings[key] ?? 0}</div></td>
            <td><div className={`rating-circle ${getScoreColor(rightRatings[key] ?? 0)}`}>{rightRatings[key] ?? 0}</div></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const DetailsTable = ({ left, right }) => (
  <div className="section-block">
    <div className="section-title">Detailed Comparison</div>
    <table className="details-table">
      <thead><tr><th>Field</th><th>{left.name}</th><th>{right.name}</th></tr></thead>
      <tbody>
        {FIELD_ORDER.map((fieldKey) => (
          <tr key={fieldKey}>
            <td className="field-label">{getFieldLabel(fieldKey)}</td>
            <td>{formatValue(getSafeFieldValue(left, fieldKey), fieldKey)}</td>
            <td>{formatValue(getSafeFieldValue(right, fieldKey), fieldKey)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const InsightsSection = ({ insights }) => (
  <div className="section-block">
    <div className="section-title">Key Insights</div>
    {insights.length > 0 ? (
      <ul className="insights-list">{insights.map((insight, idx) => <li key={idx}>{insight}</li>)}</ul>
    ) : (
      <p className="no-insights">No significant differences found between the selected contracts.</p>
    )}
  </div>
);

export default function ContractComparison() {
  const [leftId, setLeftId] = useState("");
  const [rightId, setRightId] = useState("");
  const [show, setShow] = useState(false);

  const left = contracts.find(c => c.id === leftId);
  const right = contracts.find(c => c.id === rightId);
  const contractsValid = left && right && validateContract(left).isValid && validateContract(right).isValid;

  const leftRatings = useMemo(() => calculateContractRatings(left), [left]);
  const rightRatings = useMemo(() => calculateContractRatings(right), [right]);
  const leftScore = useMemo(() => calculateTotalScore(leftRatings), [leftRatings]);
  const rightScore = useMemo(() => calculateTotalScore(rightRatings), [rightRatings]);
  const insights = useMemo(() => show && contractsValid ? generateInsights(left, right) : [], [show, left, right, contractsValid]);

  return (
    <div className="page-wrapper">
      <div className="header-box">
        <h1>Car Lease Contract Comparison</h1>
        <p>Ratings, Detailed Comparison, and Insights</p>
      </div>

      <div className="select-section">
        <select value={leftId} onChange={(e) => { setLeftId(e.target.value); setShow(false); }}>
          <option value="">Select Contract 1</option>
          {contracts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={rightId} onChange={(e) => { setRightId(e.target.value); setShow(false); }}>
          <option value="">Select Contract 2</option>
          {contracts.filter((c) => c.id !== leftId).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button disabled={!areContractsDifferent(leftId, rightId)} onClick={() => contractsValid && setShow(true)}>Compare</button>
      </div>

      {show && contractsValid && left && right && (
        <>
          <ScoreBanner left={left} right={right} leftScore={leftScore} rightScore={rightScore} winner={leftScore > rightScore ? "left" : "right"} />
          <RatingsTable left={left} right={right} leftRatings={leftRatings} rightRatings={rightRatings} />
          <DetailsTable left={left} right={right} />
          <InsightsSection insights={insights} />
        </>
      )}

      {show && !contractsValid && (
        <div className="error-box">
          <h3>⚠️ Data Validation Error</h3>
          <p>One or both contracts have incomplete or invalid data.</p>
          {left && !validateContract(left).isValid && (
            <div><strong>{left.name} errors:</strong><ul>{validateContract(left).errors.map((err, idx) => <li key={idx}>{err}</li>)}</ul></div>
          )}
          {right && !validateContract(right).isValid && (
            <div><strong>{right.name} errors:</strong><ul>{validateContract(right).errors.map((err, idx) => <li key={idx}>{err}</li>)}</ul></div>
          )}
        </div>
      )}
    </div>
  );
}
