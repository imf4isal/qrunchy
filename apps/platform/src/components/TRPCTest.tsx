import { trpc } from '@/utils/trpc';

export default function TRPCTest() {
  const testQuery = trpc.auth.test.useQuery();

  return (
    <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
      <h3 className="font-bold text-yellow-800">tRPC Connection Test</h3>
      <div className="mt-2">
        {testQuery.isLoading && <p>Loading...</p>}
        {testQuery.error && (
          <p className="text-red-600">
            Error: {testQuery.error.message}
          </p>
        )}
        {testQuery.data && (
          <p className="text-green-600">
            Success: {testQuery.data.message}
          </p>
        )}
      </div>
    </div>
  );
}