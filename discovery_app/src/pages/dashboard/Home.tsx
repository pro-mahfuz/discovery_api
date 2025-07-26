import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import PageMeta from "../../components/common/PageMeta";

import { useEffect } from "react";
import { useNavigate  } from 'react-router-dom';

import { selectAccessToken, selectUser, selectAuthStatus } from "../../modules/auth/features/authSelectors";
import { useSelector } from "react-redux";



export default function Home() {
  const accessToken = useSelector(selectAccessToken);
  const authUser = useSelector(selectUser);
  const authStatus = useSelector(selectAuthStatus);

  const navigate = useNavigate();

  useEffect(() => {
    if (authStatus === 'idle' || authStatus === 'loading') return;
    if (!accessToken || !authUser) {
      navigate("/signin", { replace: true });
    }
  }, [authStatus, accessToken, authUser, navigate]);
  
  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />

          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <StatisticsChart />
        </div>

      </div>
    </>
  );
}
