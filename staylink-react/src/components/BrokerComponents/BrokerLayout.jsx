import BrokerNavbar from "./BrokerNavbar";

const BrokerLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <BrokerNavbar />

      <main className="pt-24 px-4 sm:px-6 lg:px-8 pb-10">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default BrokerLayout;