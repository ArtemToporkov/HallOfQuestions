import type { ReactElement } from 'react';

export function Footer(): ReactElement {
    return (
        <div className="footer">
            <span className="footer__text">
                frontend v1.1.1
            </span>
            <span className="footer__text">
                backend replica v1.1.1-hfa7s65dfhkasjhf
            </span>
        </div>
    )
}