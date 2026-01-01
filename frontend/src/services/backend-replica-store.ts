type Listener = (id: string) => void;

let currentReplicaId: string = 'waiting for server response';
const listeners = new Set<Listener>();

export const setReplicaId = (id: string) => {
    if (currentReplicaId !== id) {
        currentReplicaId = id;
        listeners.forEach((listener) => listener(id));
    }
};

export const getReplicaId = () => currentReplicaId;

export const subscribeToReplicaId = (listener: Listener) => {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
};