"use server";

import { headers, cookies } from "next/headers";
import React from "react";

async function getServerInfo() {
    const headersList = await headers();
    const cookieStore = await cookies();
    const userAgent = headersList.get("user-agent") || "unknown";
    const timestamp = new Date().toISOString();
    
    return {
        userAgent: userAgent.substring(0, 20) + "...",
        timestamp,
        hasCookies: cookieStore.getAll().length > 0
    };
}

export const ServerButton = async () => {
    const serverInfo = await getServerInfo();
    
    return (
        <div className="space-y-2">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Server Button
            </button>
            <div className="text-sm text-gray-600">
                <p>🕒 Server Time: {serverInfo.timestamp}</p>
                <p>🌐 User Agent: {serverInfo.userAgent}</p>
                <p>🍪 Has Cookies: {serverInfo.hasCookies ? "Yes" : "No"}</p>
            </div>
        </div>
    );
};
