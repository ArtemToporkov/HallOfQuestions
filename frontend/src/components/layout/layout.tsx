import type { PropsWithChildren, ReactElement } from 'react';
import { Header } from '../header/header.tsx';
import { Footer } from '../footer/footer.tsx';

type LayoutProps = PropsWithChildren<object>;

export function Layout({ children }: LayoutProps): ReactElement {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    )
} 