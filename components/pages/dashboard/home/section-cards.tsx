import SectionCard from "./section-card";
import { Users, UserCheck } from "lucide-react";

const SectionCards = () => {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-4">
      <SectionCard title="Total Patients" value="1,247" icon={Users} />
      <SectionCard title="Today's Patients" value="23" icon={UserCheck} />
    </div>
  );
};

export default SectionCards;
