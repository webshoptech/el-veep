"use client";

import { useEffect } from "react";

declare global {
    interface Window {
        google?: {
            accounts: {
                id: {
                    initialize: (options: {
                        client_id: string;
                        callback: (response: CredentialResponse) => void;
                        auto_select?: boolean;
                        cancel_on_tap_outside?: boolean;
                    }) => void;
                    prompt: () => void;
                };
            };
        };
    }
}

type CredentialResponse = {
    credential?: string;
    select_by?: string;
    clientId?: string;
};

export default function GoogleOneTap() {
    useEffect(() => {
        window.google?.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            callback: (response: CredentialResponse) => {
                if (response.credential) {
                    console.log("Credential:", response.credential);
                    // send to your API for verification
                }
            },
            auto_select: false,
            cancel_on_tap_outside: true,
        });

        window.google?.accounts.id.prompt();
    }, []);

    return null;
}