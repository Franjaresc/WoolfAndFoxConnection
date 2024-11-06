import { useAppSelector } from "@/redux/hooks";
import { selectCompanyData } from "@/redux/reducers/companySlice";
import CompanyContent from "@/utils/CompanyContent";

export default function CompanySection() {
    const { company, loading:loadingCompany, error:errorCompany } = useAppSelector(selectCompanyData);
    return (
        <CompanyContent company={company} loading={loadingCompany} error={errorCompany} />
    )
}