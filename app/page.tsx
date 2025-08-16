import Image from 'next/image';
import Link from 'next/link';

import { LoginButton } from '@/Components/Login/LoginButton';
import { Button } from '@/Components/ui/button';
import { PropertyList } from '@/Components/PropertyList';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Hackerhouse Protocol</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PropertyList />
          </div>
          <div className="space-y-6">
            {/* Dashboard will be recreated by v0 */}
          </div>
        </div>
      </div>
    </div>
  );
}
