import React, { useEffect, useState } from 'react';

// Checks user-agent for typical in-app browser identifiers
function isLikelyInAppBrowser() {
    if (typeof navigator === 'undefined') return false;
    const userAgent = navigator.userAgent.toLowerCase();
    // Common substrings for embedded in-app browsers:
    //  instagram, fbav (Facebook), line, snapchat, messenger, twitter, tiktok, etc.
    return /instagram|fbav|facebook|line|snapchat|messenger|twitter|tiktok/i.test(userAgent);
}

export default function InAppBrowserWarning() {
    const [inApp, setInApp] = useState(false);

    useEffect(() => {
        setInApp(isLikelyInAppBrowser());
    }, []);

    if (!inApp) return null; // If not in an in-app browser, show nothing

    // If in an in-app browser, show a warning or fallback UI

    return (
        <div style={{
            backgroundColor: '#ffe8a1',
            padding: '1rem',
            margin: '1rem',
            textAlign: 'center',
            border: '1px solid #ccc',
            borderRadius: '4px'
            }}>
            <h3>In-App Browser Detected</h3>
            <p>
                Google sign‑in may be blocked in this browser.
                Please open this page in your default browser (Safari, Chrome, etc.)
                to continue.
            </p>
            <button
                onClick={() => {
                // Attempt to open in the user’s default browser
                window.open('https://heightshousing.com', '_blank', 'noopener,noreferrer');
                }}
                style={{
                backgroundColor: '#ccc',
                padding: '0.5rem 1rem',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem'
                }}
            >
                Open in your browser
            </button>
            <p style={{ marginTop: '1rem' }}>
                If that doesn’t work, look for the “Open in Browser” option in your app’s menu.
            </p>
        </div>
    );
}
