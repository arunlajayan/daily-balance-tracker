import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/server/routers/_app';
import { httpBatchLink } from "@trpc/client";


// This exports the strongly-typed hooks you will use in your components
export const trpc = createTRPCReact<AppRouter>();


let isRefreshing = false;
interface QueueItem {
    resolve: (value: string | PromiseLike<string>) => void;
    reject: (reason?: unknown) => void;
}

const failedQueue: QueueItem[] = [];

function processQueue(error: Error | null, token: string | null) {
    failedQueue.forEach((item) => {
        if (error) {
            item.reject(error);
        } else if (token) {
            item.resolve(token);
        }
    });
    failedQueue.length = 0; // Clear the queue
}


export function getTRPCClient(url: string) {
    return trpc.createClient({
    links: [
      httpBatchLink({
        url,
        headers: async () => {
            const token = localStorage.getItem("accessToken");
            return { Authorization: token ? `Bearer ${token}` : "" };
        },
        fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
            const response = await fetch(input, init);

            if (response.status === 401 && !url.includes("auth.refresh")) {
                const refreshToken = localStorage.getItem("refreshToken");
                if (!refreshToken) throw new Error("Not authenticated");

                if (isRefreshing) {
                    // Wait for refresh to complete, then retry
                    const token = await new Promise<string>((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    });
                    return fetch(input, { ...init, headers: { ...init?.headers, Authorization: `Bearer ${token}` } });
                }

                isRefreshing = true;
                let newAccessToken: string | null = null;

                try {
                    const refreshMutation = trpc.auth.refresh.useMutation({
                        onSuccess: (data) => {
                            // Access your new tokens here
                            console.log("New access token:", data.accessToken);
                        },
                        onError: (error) => {
                            console.error("Refresh failed:", error.message);
                        }
                    });

                    const data = await refreshMutation;
                    if (data.error) throw new Error(data.error.message);

                    newAccessToken = data.data?.accessToken ?? "";
                    localStorage.setItem("accessToken", data.data?.accessToken ?? "");
                    localStorage.setItem("refreshToken", data.data?.accessToken ?? "");

                    processQueue(null, newAccessToken);
                } catch (error) {
                    const err = error instanceof Error ? error : new Error(String(error));
                    processQueue(err, null);
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    // window.location.href = "/login";
                } finally {
                    isRefreshing = false;
                }

                // Retry original request with new token
                return fetch(input, { ...init, headers: { ...init?.headers, Authorization: `Bearer ${newAccessToken}` } });
            }

            return response;
       },
      }),
    ],
  });
}