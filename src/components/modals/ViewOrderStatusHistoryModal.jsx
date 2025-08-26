import { useEffect, useState } from "react";
import { Modal } from "../ui";
import { formatToVietnamTime } from "../../helpers/dateTimeHelper";
import OrderStatusBadge from "../ui/OrderStatusBadge";
import UserMiniProfile from "../../pages/components/UserMiniProfile"


const ViewOrderStatusHistoryModal = ({
  isOpen,
  onClose,
  history,
}) => {
  const [sortedHistory, setSortedHistory] =  useState([]);

  useEffect(() => {
    const temp = history
    ?.slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setSortedHistory(temp);
  }, [history])

  const sizeStyles = {
    lg: [
      "mb-12",
      "w-4 h-4 mt-1.5 -start-2",
      "mt-3",
      "w-5 h-5",
      "text-theme-md",
      "mt-4",
      "w-12 h-12",
      400,
      "text-[17px]",
      "text-[14px]",
      "text-[20px]",
    ],
    sm: [
      "mb-10",
      "w-3 h-3 mt-1.5 -start-1.5",
      "mt-2",
      "w-3 h-3",
      "text-theme-xs",
      "mt-3",
      "w-8 h-8",
      200,
      "text-[13px]",
      "text-[11px]",
      "text-[16px]",
    ],
  };
  const styles = sizeStyles["lg"];

   const isStatusMovingForward = (
    newStatus,
    defaultStatus
  ) => {
    if (!defaultStatus) return true;
    return newStatus > defaultStatus;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      justify={"center"}
      items={"center"}
      className="max-w-[95%] md:max-w-[70%] lg:max-w-[40%] m-4"
    >
      <div className="max-h-[85vh] custom-scrollbar relative overflow-y-auto rounded-xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="w-full max-w-3xl mx-auto">
          <div className="pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Lịch sử trạng thái
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Hiển thị lịch sử chỉnh sửa trạng thái của đơn hàng
            </p>
          </div>
          {history && (
            <ol className="relative border-s border-gray-200 dark:border-gray-700 font-[Inter]">
      {sortedHistory?.map((item) => (
        <li key={item.orderStatusHistoryId} className={`${styles[0]} ms-4`}>
          {/* created at */}
          <div
            className={`${styles[1]} absolute bg-gray-200 rounded-full border border-white dark:border-gray-900 dark:bg-gray-700`}
          ></div>
          <time className="text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
            {formatToVietnamTime(item.createdAt)}
          </time>
          {/* item.status */}
          <div
            className={`${styles[2]} text-md font-medium text-gray-700 dark:text-white flex items-center gap-1`}
          >
            <div>
              <OrderStatusBadge
                status={item.oldStatus}
                size={"md"}
                className="rounded-sm"
              />
            </div>
            <div>
              <svg
                className={`${styles[3]} text-gray-500 dark:text-gray-400`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m9 5 7 7-7 7"
                />
              </svg>
            </div>
            <div>
              <OrderStatusBadge
                status={item.newStatus}
                size={"md"}
                className="rounded-sm"
              />
            </div>
            {!isStatusMovingForward(item.newStatus, item.oldStatus) && (
              <div className={`${styles[10]} text-red-400 -mb-[2px]`}>!</div>
            )}
          </div>
          {/* item.reason */}
          {item.reason && (
            <div className="flex">
              <div
                className={`${styles[4]} ${styles[5]} text-gray-500 font-[Roboto] dark:text-white/90p-2 py-1 px-2.5 rounded-sm bg-gray-100 dark:bg-white/5`}
              >
                {item.reason}
              </div>
            </div>
          )}
          {/* {item.createdBy} */}
          <div className="mt-2">
          <UserMiniProfile userId={item.createdBy} showName />

          </div>
        </li>
      ))}
    </ol>
          )}
          <div className="mt-6 flex justify-end">
            <button onClick={() => onClose()}>Thoát</button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewOrderStatusHistoryModal;
