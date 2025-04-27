import Head from 'next/head';
import BatchForm from './components/BatchForm';
import BatchList from './components/BatchList';
import DemandForecast from './components/DemandForecast';

export default function Home() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <Head>
        <title>Coffee Supply Chain Blockchain</title>
        <meta name="description" content="Blockchain-based coffee supply chain management" />
      </Head>
      <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
        Coffee Supply Chain Management
      </h1>
      <BatchForm />
      <BatchList />
      <DemandForecast />
    </div>
  );
}