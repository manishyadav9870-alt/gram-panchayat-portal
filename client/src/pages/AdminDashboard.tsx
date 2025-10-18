import { useEffect, useState } from 'react';
import { useLocation, Link } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, FileText, Baby, Skull, Megaphone, Plus, Menu, X, LayoutDashboard, Home, Users, UserCog } from 'lucide-react';
import ComplaintsTable from '@/components/admin/ComplaintsTable';
import BirthCertificatesTable from '@/components/admin/BirthCertificatesTable';
import DeathCertificatesTable from '@/components/admin/DeathCertificatesTable';
import AnnouncementsTable from '@/components/admin/AnnouncementsTable';
import UsersTable from '@/components/admin/UsersTable';

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { user, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setLocation('/admin/login');
    }
  }, [user, loading, setLocation]);

  const handleLogout = async () => {
    await logout();
    setLocation('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', value: 'complaints' },
    { icon: FileText, label: 'Complaints', value: 'complaints' },
    { icon: Baby, label: 'Birth Certificates', value: 'birth' },
    { icon: Skull, label: 'Death Certificates', value: 'death' },
    { icon: Megaphone, label: 'Announcements', value: 'announcements' },
    { icon: UserCog, label: 'User Management', value: 'users' },
    { icon: Home, label: 'Go to Home', action: () => setLocation('/') },
  ];

  const [activeTab, setActiveTab] = useState('complaints');

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-slate-900 to-slate-800 text-white transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static shadow-2xl`}>
        <div className="flex flex-col h-full">
          {/* Profile Section */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-2xl font-bold shadow-lg">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-lg">{user?.username}</h3>
                <p className="text-sm text-gray-300">Administrator</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else {
                      setActiveTab(item.value);
                      setSidebarOpen(false);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === item.value
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-white/10">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="border-b bg-card sticky top-0 z-30 shadow-sm">
          <div className="px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                <Menu className="w-6 h-6" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome, {user?.username}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'complaints' && (
            <Card>
              <CardHeader>
                <CardTitle>Complaints Management</CardTitle>
                <CardDescription>
                  View, edit, and manage all complaints
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ComplaintsTable />
              </CardContent>
            </Card>
          )}

          {activeTab === 'birth' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Birth Certificates Management</CardTitle>
                    <CardDescription>
                      View, edit, and manage all birth certificate applications
                    </CardDescription>
                  </div>
                  <Link href="/admin/birth-certificates">
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      Manage Certificates
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <BirthCertificatesTable />
              </CardContent>
            </Card>
          )}

          {activeTab === 'death' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Death Certificates Management</CardTitle>
                    <CardDescription>
                      View, edit, and manage all death certificate applications
                    </CardDescription>
                  </div>
                  <Link href="/admin/death-certificates">
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      Manage Certificates
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <DeathCertificatesTable />
              </CardContent>
            </Card>
          )}

          {activeTab === 'announcements' && (
            <Card>
              <CardHeader>
                <CardTitle>Announcements Management</CardTitle>
                <CardDescription>
                  Create, edit, and manage announcements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnnouncementsTable />
              </CardContent>
            </Card>
          )}

          {activeTab === 'users' && (
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Create, edit, and manage user accounts with roles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UsersTable />
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
