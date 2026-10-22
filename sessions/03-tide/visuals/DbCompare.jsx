import { useState } from 'react';

// The same student data as a SQL table and as NoSQL documents.
const ROWS = [['101', 'Ravi', 'CSE', 'A+'], ['102', 'Ananya', 'ECE', 'A'], ['103', 'Kabir', 'CSE', 'B+']];

export default function DbCompare() {
  const [mode, setMode] = useState('sql');
  return (
    <div>
      <div className="seg" style={{ marginBottom: 12 }}>
        <button type="button" aria-pressed={mode === 'sql'} onClick={() => setMode('sql')}>SQL (tables)</button>
        <button type="button" aria-pressed={mode === 'nosql'} onClick={() => setMode('nosql')}>NoSQL (documents)</button>
      </div>
      {mode === 'sql' ? (
        <div className="split-2-1">
          <table className="table-sim">
            <thead><tr><th>roll</th><th>name</th><th>branch</th><th>grade</th></tr></thead>
            <tbody>{ROWS.map(r => <tr key={r[0]}>{r.map(c => <td key={c}>{c}</td>)}</tr>)}</tbody>
          </table>
          <pre className="code-view">{`SELECT name, grade
FROM students
WHERE branch = 'CSE';`}</pre>
        </div>
      ) : (
        <pre className="code-view">{ROWS.map(([roll, name, branch, grade]) => `{ "roll": "${roll}", "name": "${name}", "branch": "${branch}", "grade": "${grade}"${roll === '101' ? ', "clubs": ["coding", "music"]' : ''} }`).join('\n')}</pre>
      )}
      <p className="d-note">
        {mode === 'sql'
          ? 'SQL: fixed columns, great for marks, fees and anything with clear structure. Cloud versions: Amazon RDS, Google Cloud SQL, Azure SQL Database.'
          : 'NoSQL: flexible documents (notice Ravi has an extra “clubs” field). Great for chats, feeds and fast-changing apps. Cloud versions: DynamoDB, Firestore, Cosmos DB.'}
      </p>
    </div>
  );
}
