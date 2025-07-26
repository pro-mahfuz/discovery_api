import { useEffect } from "react";

import PageBreadcrumb from "../../../components/common/PageBreadCrumb.tsx";
import PageMeta from "../../../components/common/PageMeta.tsx";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store/store.ts";
import { fetchPermission } from "../features/permissionThunks.ts";
import { selectAllPermissions, selectPermissionStatus } from "../features/permissionSelectors.ts";


export default function PermissionTable() {

  const dispatch = useDispatch<AppDispatch>();
  const permissions = useSelector(selectAllPermissions);
  const status = useSelector(selectPermissionStatus);
 
  

  useEffect(() => {
    dispatch(fetchPermission());
  }, [dispatch]);

  

  return (
    <>
      <PageMeta
        title="Permission List Table"
        description="Permission Table with Search, Sort, Pagination"
      />
      <PageBreadcrumb pageTitle="Permission List" />

      <div className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full">
            {/* Search Input */}

            {/* Table */}
            <div className="grid grid-flow-col grid-rows-4 gap-4 p-4">
              {
                status === 'loading' ? (
                  "Loading users..."
                ) :permissions.map((permission, index) => (
                  <div key={permission.id} className="border p-2 rounded bg-gray-100 dark:bg-gray-800">
                    <div className="flex justify-between text-sm font-semibold"><div>{index + 1}. {permission.name}</div> <div>( {permission.action} )</div></div>
                  </div>
              ))}
            </div>
          </div>

          
        </div>
      </div>

      
    </>
  );
}
