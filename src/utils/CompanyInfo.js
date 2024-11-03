import Loader from "@/components/Loader";
import ErrorMessage from "@/utils/ErrorMessage";

const CompanyInfo = ({ company, loading, error }) => {
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message="There was an error loading the company data. Please try again later." />;
  if (!company.length) return <ErrorMessage message="No company data found." />;

  return (
    <div>
      <h2>Company Information</h2>
      <p>{JSON.stringify(company)}</p>
    </div>
  );
};

export default CompanyInfo;
