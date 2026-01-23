import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminNavbar from "@/components/AdminNavbar";

export default async function AdminDashboard() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Selamat Datang, {session.user?.name || "Admin"}!
            </h2>
            <p className="text-gray-600">
              Anda berhasil login ke dashboard admin.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/admin/blogs" className="block">
              <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer border border-transparent hover:border-blue-500">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Manajemen Blog
                </h3>
                <p className="text-gray-600">
                  Kelola artikel dan dokumentasi kegiatan.
                </p>
                <div className="mt-4 text-blue-600 font-medium text-sm">
                  Kelola Blog &rarr;
                </div>
              </div>
            </Link>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Total Users
              </h3>
              <p className="text-3xl font-bold text-blue-600">0</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Active Sessions
              </h3>
              <p className="text-3xl font-bold text-green-600">1</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
