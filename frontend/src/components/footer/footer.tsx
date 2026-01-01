import type { ReactElement } from 'react';

import './footer.css';

export function Footer(): ReactElement {
    return (
        <footer className="footer">
            <span className="footer__text">
                backend replica v1.1.1-hfa7s65dfhkasjhf
            </span>
            <span className="footer__text">
                frontend {import.meta.env.FRONTEND_VERSION ?? `v?.?.?`}
            </span>
        </footer>
    )
}