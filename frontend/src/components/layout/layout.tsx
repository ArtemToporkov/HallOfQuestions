import type { PropsWithChildren, ReactElement } from 'react';

import { Header } from '../header/header.tsx';
import { Footer } from '../footer/footer.tsx';
import { Main } from '../main/main.tsx';

type LayoutProps = PropsWithChildren<object>;

export function Layout({ children }: LayoutProps): ReactElement {
    return (
        <>
            <Header />
            <Main>
                {children}
            </Main>
            <Footer />
        </>
    )
} 