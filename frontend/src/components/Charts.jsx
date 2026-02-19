import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CTRL_COLOR = '#D94F3D';
const ACCD_COLOR = '#2E86AB';
const BIO_COLOR = '#A23B72';

function ModelChart({ title, data, lines }) {
    return (
        <div className="chart-card">
            <h3>{title}</h3>
            <ResponsiveContainer width="100%" height={320}>
                <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,45,69,0.5)" />
                    <XAxis
                        dataKey="t"
                        stroke="#64748b"
                        fontSize={10}
                        tickFormatter={(v) => v.toFixed(0)}
                        label={{ value: 'Time (h)', position: 'insideBottom', offset: -2, fill: '#94a3b8', fontSize: 11 }}
                    />
                    <YAxis
                        stroke="#64748b"
                        fontSize={10}
                        tickFormatter={(v) => v.toExponential(1)}
                    />
                    <Tooltip
                        contentStyle={{ background: '#1a2233', border: '1px solid #1e2d45', borderRadius: 8, color: '#e2e8f0' }}
                        labelFormatter={(v) => `t = ${Number(v).toFixed(2)} h`}
                        formatter={(v, name) => [v.toExponential(4), name]}
                    />
                    <Legend wrapperStyle={{ color: '#e2e8f0', fontSize: 11 }} />
                    {lines.map((l) => (
                        <Line
                            key={l.dataKey}
                            type="monotone"
                            dataKey={l.dataKey}
                            name={l.name}
                            stroke={l.color}
                            dot={false}
                            strokeWidth={2}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default function Charts({ timeSeries }) {
    if (!timeSeries) return null;

    const data = timeSeries.time.map((t, i) => ({
        t,
        E_ctrl: timeSeries.ctrl.E[i],
        E_accd: timeSeries.accd.E[i],
        Ar_ctrl: timeSeries.ctrl.Ar[i],
        Ar_accd: timeSeries.accd.Ar[i],
        Xb_accd: timeSeries.accd.Xb[i],
        G_ctrl: timeSeries.ctrl.G[i],
        G_accd: timeSeries.accd.G[i],
    }));

    return (
        <div className="section">
            <h2 className="section-title"><span className="dot" /> Simulation Plots</h2>
            <div className="chart-grid">
                <ModelChart
                    title="(A) Ethylene in Greenhouse Air"
                    data={data}
                    lines={[
                        { dataKey: 'E_ctrl', name: 'Control', color: CTRL_COLOR },
                        { dataKey: 'E_accd', name: 'With ACCD', color: ACCD_COLOR },
                    ]}
                />
                <ModelChart
                    title="(B) ACC in Root Zone (Sink Effect)"
                    data={data}
                    lines={[
                        { dataKey: 'Ar_ctrl', name: 'Control', color: CTRL_COLOR },
                        { dataKey: 'Ar_accd', name: 'With ACCD', color: ACCD_COLOR },
                    ]}
                />
                <ModelChart
                    title="(C) Bacterial Biomass (B. subtilis)"
                    data={data}
                    lines={[
                        { dataKey: 'Xb_accd', name: 'B. subtilis', color: BIO_COLOR },
                    ]}
                />
                <ModelChart
                    title="(D) Plant Growth Index"
                    data={data}
                    lines={[
                        { dataKey: 'G_ctrl', name: 'Control', color: CTRL_COLOR },
                        { dataKey: 'G_accd', name: 'With ACCD', color: ACCD_COLOR },
                    ]}
                />
            </div>
        </div>
    );
}
