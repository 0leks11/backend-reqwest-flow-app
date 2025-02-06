import React from "react";
import { Organization as Org } from "./Logic";

interface OrganizationProps {
  orgData: Org;
  onSelect: (id: string) => void;
}

const Organization: React.FC<OrganizationProps> = ({ orgData, onSelect }) => {
  const handleClick = () => {
    onSelect(orgData.id);
  };

  return (
    <div className="border border-gray-300 p-4 m-2 rounded">
      <p>
        <strong>Оrganisation:</strong> {orgData.name}
      </p>
      <button
        onClick={handleClick}
        className="bg-blue-500 text-white px-3 py-1 mt-2 rounded hover:bg-blue-600 transition"
      >
        Choice
      </button>
    </div>
  );
};

export default Organization;
