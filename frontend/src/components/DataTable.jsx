export default function DataTable({ timeSeries, params }) {
    if (!timeSeries) return null;

    const time = timeSeries.time;
    const step = Math.max(1, Math.floor(time.length / 200));
    const indices = [];
    for (let i = 0; i < time.length; i += step) indices.push(i);
    if (indices[indices.length - 1] !== time.length - 1) indices.push(time.length - 1);

    const downloadResults = () => {
        let csv = 'Time_h,Ap_ctrl_mM,Ar_ctrl_mM,E_ctrl_uM,Xb_ctrl,G_ctrl,Ap_ACCD_mM,Ar_ACCD_mM,E_ACCD_uM,Xb_ACCD,G_ACCD\n';
        for (let i = 0; i < time.length; i++) {
            csv += [
                time[i].toFixed(4),
                timeSeries.ctrl.Ap[i], timeSeries.ctrl.Ar[i], timeSeries.ctrl.E[i], timeSeries.ctrl.Xb[i], timeSeries.ctrl.G[i],
                timeSeries.accd.Ap[i], timeSeries.accd.Ar[i], timeSeries.accd.E[i], timeSeries.accd.Xb[i], timeSeries.accd.G[i],
            ].join(',') + '\n';
        }
        download(csv, 'acc_ethylene_simulation_results.csv');
    };

    const downloadParams = () => {
        if (!params) return;
        let csv = 'Symbol,Value,Unit,Description\n';
        const meta = [
            ['v_ACS', 'mM/h', 'Max ACC synthesis rate'], ['f_stress', '-', 'Stress factor'],
            ['k_ACO', '1/h', 'ACC oxidase rate'], ['k_exp', '1/h', 'ACC export rate'],
            ['Y_eth', 'mol/mol', 'Ethylene yield'], ['V_max_ACCD', 'mM/(g*h)', 'Max ACCD rate'],
            ['K_m_ACCD', 'mM', 'ACCD Km'], ['mu_max', '1/h', 'Max growth rate'],
            ['K_s', 'mM', 'Monod Ks'], ['k_d', '1/h', 'Decay rate'],
            ['Vp_Vr', 'ratio', 'Plant/root vol'], ['Vp_Vair', 'ratio', 'Plant/air vol'],
            ['k_vent', '1/h', 'Ventilation rate'], ['k_scrub', '1/h', 'Scrubber rate'],
            ['k_loss', '1/h', 'ACC loss rate'], ['r_g', '1/h', 'Growth rate'],
            ['K_E', 'uM', 'Ethylene IC50'], ['n_hill', '-', 'Hill coefficient'],
        ];
        meta.forEach(([sym, unit, desc]) => {
            csv += `"${sym}","${params[sym] ?? ''}","${unit}","${desc}"\n`;
        });
        download(csv, 'acc_model_parameters.csv');
    };

    const download = (content, filename) => {
        const blob = new Blob([content], { type: 'text/csv' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
        URL.revokeObjectURL(a.href);
    };

    const fmt = (v) => v?.toExponential(4) ?? '-';

    return (
        <div className="section">
            <h2 className="section-title"><span className="dot" /> Time-Series Data</h2>
            <div className="btn-row" style={{ justifyContent: 'flex-start' }}>
                <button className="btn btn-secondary" onClick={downloadResults}>
                    ⬇ Download Results CSV
                </button>
                <button className="btn btn-secondary" onClick={downloadParams}>
                    ⬇ Download Parameters CSV
                </button>
            </div>
            <div className="table-wrap">
                <div className="table-scroll">
                    <table>
                        <thead>
                            <tr>
                                <th>Time (h)</th>
                                <th>Ap ctrl</th><th>Ar ctrl</th><th>E ctrl</th><th>Xb ctrl</th><th>G ctrl</th>
                                <th>Ap ACCD</th><th>Ar ACCD</th><th>E ACCD</th><th>Xb ACCD</th><th>G ACCD</th>
                            </tr>
                        </thead>
                        <tbody>
                            {indices.map((i) => (
                                <tr key={i}>
                                    <td>{time[i].toFixed(2)}</td>
                                    <td>{fmt(timeSeries.ctrl.Ap[i])}</td>
                                    <td>{fmt(timeSeries.ctrl.Ar[i])}</td>
                                    <td>{fmt(timeSeries.ctrl.E[i])}</td>
                                    <td>{fmt(timeSeries.ctrl.Xb[i])}</td>
                                    <td>{fmt(timeSeries.ctrl.G[i])}</td>
                                    <td>{fmt(timeSeries.accd.Ap[i])}</td>
                                    <td>{fmt(timeSeries.accd.Ar[i])}</td>
                                    <td>{fmt(timeSeries.accd.E[i])}</td>
                                    <td>{fmt(timeSeries.accd.Xb[i])}</td>
                                    <td>{fmt(timeSeries.accd.G[i])}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
