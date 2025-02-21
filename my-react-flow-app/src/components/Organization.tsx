import React from "react";
import { NodeProps, Handle, Position } from "reactflow";

interface OrgData {
  orgData: { id: string; name: string };
  onSelect: (id: string) => void;
  isRelevant: boolean; // <-- теперь у нас есть признак "релевантен?"
  isSelected: boolean;
}

export default function Organization(props: NodeProps<OrgData>) {
  const { orgData, onSelect, isSelected, isRelevant } = props.data;

  const handleClick = () => {
    onSelect(orgData.id);
  };

  // Если не релевантен, делаем его полупрозрачным
  // (или меняем цвет текста)
  const opacity = isRelevant ? 1.0 : 0.2;

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "8px",
        borderRadius: 8,
        backgroundColor: isSelected ? "#d5f5e3" : "white",
        cursor: "pointer",
        width: 200,
        opacity, // применяем прозрачность
      }}
      onClick={handleClick}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-green-500"
      />
      <p>
        <strong>Organization: </strong> {orgData.name}
      </p>
      {isSelected && <p style={{ color: "green", marginTop: 4 }}>Selected!</p>}
      {!isRelevant && (
        <p style={{ color: "red", marginTop: 4, fontSize: "0.8em" }}>
          Not relevant
        </p>
      )}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-green-500"
      />
    </div>
  );
}
