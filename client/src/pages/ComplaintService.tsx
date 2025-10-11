import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ComplaintForm from '@/components/ComplaintForm';

export default function ComplaintService() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <ComplaintForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
