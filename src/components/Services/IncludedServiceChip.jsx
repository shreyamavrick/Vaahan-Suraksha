import React from "react";

const IncludedServiceChip = ({ name }) => {
  return (
    <span className="bg-gray-200 text-sm rounded-full px-3 py-1 mr-2 mb-2 inline-block">
      {name}
    </span>
  );
};

export default IncludedServiceChip;
