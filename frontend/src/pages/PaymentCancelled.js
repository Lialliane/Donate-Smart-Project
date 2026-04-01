import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { ThreeDots } from 'react-loader-spinner'

function PaymentSuccess() {
  const [session, setSession] = useState(null);
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const res = await axios.get(`/api/payment/session/${sessionId}`);
        setSession(res.data);
        console.log(res.data);
      } catch (err) {
        console.error(
          "Error fetching case:",
          err.response?.data || err.message
        );
         navigate(`/`);
      }
    };

    fetchCase();
    if(session)
        navigate(`/donate/${session?.metadata?.caseId}`);
    
  }, [navigate, session, sessionId]);

  return (
    <section className="pt-8 pb-20">
        <div className="container mx-auto h-screen">
          <h3 className="mb-9 text-2xl text-center font-semibold text-[var(--color-text-dark)] ">
            Loading 
          </h3>
          <ThreeDots
            visible={true}
            height="60"
            width="60"
            color="var(--color-primary"
            radius="9"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClass="justify-center"
            />
        </div>
      </section>
  );
}

export default PaymentSuccess;


