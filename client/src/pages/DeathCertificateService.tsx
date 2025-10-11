import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DeathCertificateForm from '@/components/DeathCertificateForm';

export default function DeathCertificateService() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <DeathCertificateForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
