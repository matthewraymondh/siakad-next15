import ViewSKS from "./ViewSKS";

type MataKuliah = {
  id: number;
  kodeMk: string;
  namaMk: string;
  sks: number;
};

type Krs = {
  id: number;
  MataKuliah: MataKuliah;
};

type Mahasiswa = {
  id: number;
  nim: string;
  nama: string;
  ipk: number;
  sksMax: number;
  krs: Krs[];
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params; // Await the params Promise
  const { id } = resolvedParams;

  // Fetch Mahasiswa details on the server side
  const response = await fetch(`http://localhost:3000/api/mahasiswa/${id}`);

  if (!response.ok) {
    return <div>Error loading data. Please check the ID.</div>;
  }

  const { mahasiswa }: { mahasiswa: Mahasiswa } = await response.json();

  // Pass fetched data to the Client Component
  return <ViewSKS mahasiswa={mahasiswa} />;
}
