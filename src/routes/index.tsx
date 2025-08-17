import { Button } from '@/components/ui/button';
import { useHypergraphApp } from '@graphprotocol/hypergraph-react';
import { Link, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const { redirectToConnect } = useHypergraphApp();

  const handleSignIn = () => {
    redirectToConnect({
      storage: localStorage,
      connectUrl: 'https://connect.geobrowser.io/',
      successUrl: `${window.location.origin}/authenticate-success`,
      redirectFn: (url: URL) => {
        window.location.href = url.toString();
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <img src="/hypergraph.svg" alt="Hypergraph Logo" className="w-24 h-24 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome to Hypergraph
        </h1>
        <p className="text-lg text-muted-foreground">Your web3 app template powered by Hypergraph</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {/* Section 1: Explore existing public knowledge */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-blue-600 dark:text-blue-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-3">Explore Public Knowledge</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
              Discover and explore the vast network of knowledge already available in the public Knowledge Graph.
            </p>
            <Link to="/explore-public-knowledge/projects">
              <Button variant="outline" className="w-full text-sm">
                Start Exploring
              </Button>
            </Link>
          </div>
        </div>

        {/* Section 2: Publish to Knowledge Graph */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-green-600 dark:text-green-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-3">Publish Knowledge</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
              Add properties and hacker profiles to your public knowledge graph. Authentication required.
            </p>
            <Link to="/publish-knowledge">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-sm">
                Publish Data
              </Button>
            </Link>
          </div>
        </div>

        {/* Section 3: View Published Data */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-purple-600 dark:text-purple-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-3">View Published Data</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
              Browse and search through the data you've published to your public knowledge graph.
            </p>
            <Link to="/view-published">
              <Button variant="outline" className="w-full text-sm">
                View Data
              </Button>
            </Link>
          </div>
        </div>

        {/* Section 4: Authentication */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-orange-600 dark:text-orange-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-3">Authentication</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
              Sign in with Geo Connect to manage your data and publish to the public Knowledge Graph.
            </p>
            <Button onClick={handleSignIn} className="w-full bg-orange-600 hover:bg-orange-700 text-sm">
              Sign in with Geo Connect
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
