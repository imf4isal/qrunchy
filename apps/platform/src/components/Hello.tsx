import { useState } from "react";
import { trpc } from "../utils/trpc";

export function Hello() {
  const [name, setName] = useState("");

  const helloQuery = trpc.hello.hello.useQuery({ name: name || undefined });

  const pingQuery = trpc.hello.ping.useQuery();

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">tRPC Example</h2>

      <div className="mb-6">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="px-3 py-2 border rounded-md w-full mb-2"
        />

        <div className="bg-gray-100 p-3 rounded-md">
          {helloQuery.isLoading ? (
            <p>Loading greeting...</p>
          ) : helloQuery.error ? (
            <p className="text-red-500">Error: {helloQuery.error.message}</p>
          ) : (
            <div>
              <p className="font-medium">{helloQuery.data?.greeting}</p>
              <p className="text-sm text-gray-500">{helloQuery.data?.time}</p>
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-2">API Status</h3>
        <div className="bg-gray-100 p-3 rounded-md">
          {pingQuery.isLoading ? (
            <p>Checking status...</p>
          ) : pingQuery.error ? (
            <p className="text-red-500">Error: {pingQuery.error.message}</p>
          ) : (
            <div>
              <p className="text-green-600 font-medium">
                {pingQuery.data?.status}
              </p>
              <p className="text-sm text-gray-500">
                Last checked: {pingQuery.data?.timestamp}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
