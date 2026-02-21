import { NavLink } from 'react-router-dom';
import { useState } from 'react';

const NAV_ITEMS = [
    { to: '/', icon: '🏠', label: 'Home', end: true },
    { to: '/math', icon: '📐', label: 'Math Model' },
    { to: '/simulation', icon: '🔬', label: 'Simulation' },
];

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <>
            {/* Mobile hamburger overlay */}
            <button
                className="sidebar-hamburger"
                onClick={() => setCollapsed((c) => !c)}
                aria-label="Toggle navigation"
            >
                {collapsed ? '✕' : '☰'}
            </button>

            {/* Backdrop for mobile */}
            {collapsed && (
                <div className="sidebar-backdrop" onClick={() => setCollapsed(false)} />
            )}

            <aside className={`sidebar ${collapsed ? 'sidebar-open' : ''}`}>
                {/* Logo / Brand */}
                <div className="sidebar-brand">
                    <img src="/logo_ethylene.png" alt="Logo" className="sidebar-logo" />
                    <div className="sidebar-brand-text">
                        <span className="sidebar-brand-name">ACC-Ethylene</span>
                        <span className="sidebar-brand-sub">ACCD Math Model</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="sidebar-nav">
                    {NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) =>
                                `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                            }
                            onClick={() => setCollapsed(false)}
                        >
                            <span className="sidebar-link-icon">{item.icon}</span>
                            <span className="sidebar-link-label">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Bottom */}
                <div className="sidebar-footer">
                    <span className="sidebar-footer-badge">iGEM 2026</span>
                    <span className="sidebar-footer-text">Omega-Aura</span>
                    <span className="sidebar-footer-ver">v2.0</span>
                </div>
            </aside>
        </>
    );
}
