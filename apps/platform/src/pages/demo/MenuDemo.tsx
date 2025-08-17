import React from 'react';
import { useParams } from 'wouter';

const MenuDemo: React.FC = () => {
  const params = useParams<{ restaurantName: string }>();
  const restaurantName = params.restaurantName 
    ? decodeURIComponent(params.restaurantName).replace(/-/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : 'Demo Restaurant';

  const demoMenuItems = [
    {
      category: 'Starters',
      items: [
        { name: 'Crispy Calamari', price: '$12', description: 'Fresh squid rings with marinara sauce' },
        { name: 'Buffalo Wings', price: '$14', description: '8 pieces with blue cheese dip' },
        { name: 'Loaded Nachos', price: '$16', description: 'Cheese, jalapeños, sour cream, guac' }
      ]
    },
    {
      category: 'Main Courses',
      items: [
        { name: 'Grilled Salmon', price: '$28', description: 'Atlantic salmon with seasonal vegetables' },
        { name: 'BBQ Burger', price: '$18', description: 'Angus beef, bacon, cheese, BBQ sauce' },
        { name: 'Chicken Alfredo', price: '$22', description: 'Creamy pasta with grilled chicken' }
      ]
    },
    {
      category: 'Desserts',
      items: [
        { name: 'Chocolate Lava Cake', price: '$9', description: 'Warm cake with vanilla ice cream' },
        { name: 'Cheesecake', price: '$8', description: 'New York style with berry compote' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-900">{restaurantName}</h1>
            <p className="text-sm text-neutral-600 mt-1">Digital Menu Demo</p>
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-8">
          {demoMenuItems.map((section, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
              <div className="bg-neutral-900 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">{section.category}</h2>
              </div>
              <div className="p-6 space-y-4">
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-neutral-900">{item.name}</h3>
                      <p className="text-sm text-neutral-600 mt-1">{item.description}</p>
                    </div>
                    <div className="ml-4 text-lg font-bold text-neutral-900">
                      {item.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center py-8 border-t border-neutral-200">
          <p className="text-sm text-neutral-500">
            This is a demo menu created with{' '}
            <a href="/" className="text-neutral-900 font-medium hover:underline">
              Qrunchy
            </a>
          </p>
          <p className="text-xs text-neutral-400 mt-2">
            Scan the QR code to view this menu on your phone
          </p>
        </div>
      </div>
    </div>
  );
};

export default MenuDemo;