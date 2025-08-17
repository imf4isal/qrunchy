import { type ReactNode } from "react";

interface PhotoMenuLayoutProps {
    children: ReactNode;
    sidePanel?: ReactNode;
}

export default function PhotoMenuLayout({ children, sidePanel }: PhotoMenuLayoutProps) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-gray-800 to-gray-600 text-white text-2xl font-bold rounded-xl mb-4">
                                Q
                            </div>
                            <div className="text-sm text-gray-500 font-medium">QRUNCHY</div>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Create Photo Menu
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Upload and arrange your menu photos to create a QR code menu for
                            your restaurant
                        </p>
                    </div>

                    <div className={`grid gap-8 ${sidePanel ? 'lg:grid-cols-3' : 'lg:grid-cols-1'}`}>
                        {/* main content */}
                        <div className={sidePanel ? 'lg:col-span-2' : 'lg:col-span-1'}>
                            <div className="bg-white rounded-xl shadow-sm border p-8">
                                {children}
                            </div>
                        </div>

                        {/* side panel */}
                        {sidePanel && (
                            <div className="lg:col-span-1">
                                <div className="sticky top-8">
                                    {sidePanel}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
