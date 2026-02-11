import { AdmissionSuccess } from '@/components'
import { useParams } from 'next/navigation';

const page = () => {
    const { applicationId } = useParams();
    return (
        <AdmissionSuccess applicationNumber={applicationId as string} />
    )
}

export default page