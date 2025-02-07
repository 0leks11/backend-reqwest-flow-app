import React from "react";
import { Handle, Position, NodeProps } from "reactflow";
import "reactflow/dist/style.css";

import { Organization as Org } from "./Logic";

interface OrganizationNodeData {
  orgData: Org;
  onSelect: (id: string) => void;
  isSelected?: boolean; 
}

type OrganizationProps = NodeProps<OrganizationNodeData>;

const Organization: React.FC<OrganizationProps> = ({ data }) => {
  const handleClick = () => {
    data.onSelect(data.orgData.id);
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "8px",
        borderRadius: 8,
        backgroundColor: data.isSelected ? "#d5f5e3" : "white",
        cursor: "pointer",
        width: 200,
      }}
      onClick={handleClick}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-green-500"
      />

      <p>
        <strong>Organization:</strong> {data.orgData.name}
      </p>
      <button
        onClick={(evt) => {
          evt.stopPropagation();
          handleClick();
        }}
        style={{ marginTop: 8 }}
      >
        Choice
      </button>

      {data.isSelected && (
        <p style={{ color: "green", marginTop: 4 }}>Selected!</p>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-green-500"
      />
    </div>
  );
};

export default Organization;
