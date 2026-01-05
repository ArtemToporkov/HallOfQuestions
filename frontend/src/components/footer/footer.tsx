import { type ReactElement, useEffect, useState } from 'react';

import { getReplicaId, subscribeToReplicaId } from '../../services/backend-replica-store.ts';

import './footer.css';

export function Footer(): ReactElement {
    const [backendReplicaId, setBackendReplicaId] = useState(getReplicaId());
    useEffect(() => {
        return subscribeToReplicaId((id) => setBackendReplicaId(id));
    })
    return (
        <footer className="footer">
            <span className="footer__text">
                latest backend replica: {backendReplicaId}
            </span>
            <span className="footer__text">
                frontend version: {import.meta.env.FRONTEND_VERSION}
            </span>
        </footer>
    )
}