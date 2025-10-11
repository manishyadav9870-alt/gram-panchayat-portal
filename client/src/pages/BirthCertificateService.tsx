import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BirthCertificateForm from '@/components/BirthCertificateForm';

export default function BirthCertificateService() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <BirthCertificateForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
