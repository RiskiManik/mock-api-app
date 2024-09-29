import React from "react";

const DynamicPage = ({ params }: { params: { domain: string } }) => {
  return <div>{params.domain}</div>;
};

export default DynamicPage;
