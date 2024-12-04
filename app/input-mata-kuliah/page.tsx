// app/input-mata-kuliah/page.tsx

import MataKuliahForm from "../components/MataKuliahForm";
import Sidebar from "../components/Sidebar";

const InputMataKuliahPage = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Content for input Mata Kuliah */}
      <div className="flex-1 p-6">
        <MataKuliahForm />
      </div>
    </div>
  );
};

export default InputMataKuliahPage;
