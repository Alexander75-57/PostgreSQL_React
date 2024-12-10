'use client';

import 'ag-grid-enterprise/styles/ag-grid.css';
import 'ag-grid-enterprise/styles/ag-theme-alpine.css';

import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ApolloClient, ApolloLink, ApolloProvider, HttpLink, InMemoryCache, split } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { getMainDefinition } from '@apollo/client/utilities';
import * as Sentry from '@sentry/nextjs';
import { APIProvider } from '@vis.gl/react-google-maps';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';

import StyledComponentsRegistry from '@ui/registry';

import { useAuthStore } from '@source/authentication/auth.context';

import { NotificationProvider } from '@source/components/organisms/Notification';
import { UnsavedChangesStoreProvider } from '@source/components/organisms/UnsavedChangesModal/services/context';

import { ThemeProviders } from '@app/context/ThemeProviders';
import PrivateTemplate from '@source/components/templates/PrivateTemplate';
import { AgGridProvider } from '@source/contexts/AgGridProvider';

const GOOGLE_MAP_LIBRARIES = ['drawing', 'places', 'geometry', 'routes', 'visualization'];

const PrivateLayout = ({ children }: React.PropsWithChildren) => {
    const { token } = useAuthStore();
    const router = useRouter();

    if (process.env.NODE_ENV === 'development') {
        const originalError = console.error;
        console.error = function (...args) {
            if (
                args[0] &&
                typeof args[0] === 'string' &&
                (args[0]?.toLocaleLowerCase()?.includes('unlocked') ||
                    args[0]?.toLocaleLowerCase()?.includes('watermark') ||
                    args[0]?.toLocaleLowerCase()?.includes('license') ||
                    args[0]?.includes('***********************************************'))
            ) {
                return;
            }
            originalError.apply(console, args);
        };
    }

    // Error handling link
    const errorLink = onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
            graphQLErrors.forEach(({ message, locations, path }) => {
                Sentry.captureException(new Error(`GraphQL error: ${message}`), {
                    extra: { locations, path },
                });
            });
        }

        if (networkError) {
            Sentry.captureException(new Error(`Network error: ${networkError.message}`), {
                extra: {
                    name: networkError.name,
                    message: networkError.message,
                    stack: networkError.stack,
                },
            });
        }
    });

    // HttpLink for Core Server
    const coreLink = new HttpLink({
        uri: process.env.NEXT_PUBLIC_CORE_SERVER_URL,
        headers: {
            authorization: `Bearer ${token}`,
        },
    });

    // HttpLink for ProQuoter Server
    const proQuoterLink = new HttpLink({
        uri: process.env.NEXT_PUBLIC_PRO_QUOTER_URL,
        headers: {
            authorization: `Bearer ${token}`,
        },
    });

    // ApolloLink split logic based on query name
    const link = split(
        op => {
            const definition = getMainDefinition(op.query);
            return (
                (definition.kind === 'OperationDefinition' &&
                    definition.operation === 'query' &&
                    definition.name?.value?.startsWith('Drizzle')) ||
                false
            ); // Ensure a boolean value is always returned
        },
        proQuoterLink, // Use ProQuoter link for special queries
        coreLink // Use Core link for all other queries
    );

    // Single Apollo Client using split logic
    const client = useMemo(() => {
        if (!token?.length) router.push('/login');
        return new ApolloClient({
            link: ApolloLink.from([errorLink, link]),
            cache: new InMemoryCache({
                typePolicies: {
                    Qttcml: {
                        keyFields: ['id', 'user_id'],
                    },
                },
            }),
        });
    }, [token]);

    return (
        <AntdRegistry>
            <StyledComponentsRegistry>
                <ThemeProviders>
                    <ApolloProvider client={client}>
                        <APIProvider
                            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY as string}
                            language="en"
                            libraries={GOOGLE_MAP_LIBRARIES}
                            region="US"
                        >
                            <NotificationProvider>
                                <UnsavedChangesStoreProvider>
                                    <AgGridProvider>
                                        <PrivateTemplate>{children}</PrivateTemplate>
                                    </AgGridProvider>
                                </UnsavedChangesStoreProvider>
                            </NotificationProvider>
                        </APIProvider>
                    </ApolloProvider>
                </ThemeProviders>
            </StyledComponentsRegistry>
        </AntdRegistry>
    );
};

export default observer(PrivateLayout);
