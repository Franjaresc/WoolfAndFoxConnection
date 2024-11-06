import Loader from "@/components/Loader";
import ErrorMessage from "@/utils/ErrorMessage";

const OrterTypesContent = ({ orderTypes, loading, error }) => {
    if (loading) return <Loader />;
    if (error) return <ErrorMessage message="There was an error loading the orderType data. Please try again later." />;
    if (!orderTypes.length) return <ErrorMessage message="No orderType data found." />;

    return (
        <div>
            <h2>Orders Types Information</h2>
            <p>{JSON.stringify(orderTypes)}</p>
        </div>
    );
}

export default OrterTypesContent;