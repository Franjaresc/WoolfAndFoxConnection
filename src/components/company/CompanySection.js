import { useAppSelector } from "@/redux/hooks";
import { selectCompanyData } from "@/redux/slices/companySlice";
import CompanyContent from "@/components/company/CompanyContent";

export default function CompanySection() {
    const { company, loading:loadingCompany, error:errorCompany } = useAppSelector(selectCompanyData);
    return (
        <CompanyContent company={company} loading={loadingCompany} error={errorCompany} />
    )
}