import MockApiForm from "@/features/mock-api/components/form-mockapi";
import React from "react";

const DynamicPage = ({ params }: { params: { domain: string } }) => {
  return (
    <div>
      <MockApiForm />
    </div>
  );
};

export default DynamicPage;
