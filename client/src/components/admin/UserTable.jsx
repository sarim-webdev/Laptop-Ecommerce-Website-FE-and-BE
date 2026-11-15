import { useState } from "react";
import { Link } from "react-router-dom";

const UserTable = ({
  users = [],
  loading = false,
  onRoleChange,
  onStatusChange,
  onDelete,
}) => {
  const [actionId, setActionId] = useState(null);

  /* =========================================
     HELPERS
  ========================================= */

  const getUserId = (user) =>
    user?._id || user?.id;

  const getUserName = (user) =>
    user?.name || "Unknown User";

  const getUserEmail = (user) =>
    user?.email || "No email";

  const getUserRole = (user) =>
    user?.role || "user";

  const getUserStatus = (user) =>
    user?.status || "active";

  const getAvatar = (user) =>
    user?.avatar?.url ||
    null;

  /* =========================================
     ROLE CHANGE
  ========================================= */

  const handleRoleChange = async (
    user,
    newRole
  ) => {
    const userId = getUserId(user);

    if (!userId || !onRoleChange) return;

    try {
      setActionId(userId);

      await onRoleChange(
        userId,
        newRole
      );
    } catch (error) {
      console.error(
        "Failed to update user role:",
        error
      );
    } finally {
      setActionId(null);
    }
  };

  /* =========================================
     STATUS CHANGE
  ========================================= */

  const handleStatusChange = async (
    user,
    newStatus
  ) => {
    const userId = getUserId(user);

    if (!userId || !onStatusChange) return;

    try {
      setActionId(userId);

      await onStatusChange(
        userId,
        newStatus
      );
    } catch (error) {
      console.error(
        "Failed to update user status:",
        error
      );
    } finally {
      setActionId(null);
    }
  };

  /* =========================================
     DELETE USER
  ========================================= */

  const handleDelete = async (user) => {
    const userId = getUserId(user);

    if (!userId || !onDelete) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${getUserName(
        user
      )}?`
    );

    if (!confirmed) return;

    try {
      setActionId(userId);

      await onDelete(userId);
    } catch (error) {
      console.error(
        "Failed to delete user:",
        error
      );
    } finally {
      setActionId(null);
    }
  };

  /* =========================================
     LOADING STATE
  ========================================= */

  if (loading) {
    return (
      <div className="overflow-hidden rounded-3xl border border-[#263449] bg-[#0B1220] shadow-2xl shadow-black/30">

        <div className="flex items-center justify-center px-6 py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#263449] border-t-sky-400" />
        </div>

      </div>
    );
  }

  /* =========================================
     EMPTY STATE
  ========================================= */

  if (!users.length) {
    return (
      <div className="rounded-3xl border border-[#263449] bg-[#0B1220] px-6 py-16 text-center shadow-2xl shadow-black/30">

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-sky-400/20 bg-sky-400/10 text-2xl">
          👥
        </div>

        <h3 className="mt-4 text-lg font-bold text-white">
          No users found
        </h3>

        <p className="mt-1 text-sm text-slate-400">
          There are currently no users to display.
        </p>

      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-[#263449] bg-[#0B1220] shadow-2xl shadow-black/30">

      {/* =========================================
          TABLE HEADER
      ========================================= */}

      <div className="border-b border-[#263449] bg-gradient-to-r from-[#111C2E] to-[#0B1220] px-6 py-5">

        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-400">
              NEXORA Administration
            </p>

            <h2 className="mt-2 text-lg font-bold text-white">
              Users
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Manage registered NEXORA users.
            </p>
          </div>

          <span className="w-fit rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-semibold text-sky-400">
            {users.length}{" "}
            {users.length === 1
              ? "User"
              : "Users"}
          </span>

        </div>

      </div>

      {/* =========================================
          RESPONSIVE TABLE
      ========================================= */}

      <div className="overflow-x-auto">

        <table className="min-w-[900px] w-full">

          <thead className="bg-[#172338]">

            <tr className="border-b border-[#263449] text-left">

              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                User
              </th>

              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                Role
              </th>

              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                Status
              </th>

              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                Joined
              </th>

              <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">
                Actions
              </th>

            </tr>

          </thead>

          <tbody className="divide-y divide-[#263449]">

            {users.map((user) => {
              const userId = getUserId(user);
              const avatar = getAvatar(user);
              const role = getUserRole(user);
              const status = getUserStatus(user);
              const isProcessing =
                actionId === userId;

              return (
                <tr
                  key={userId}
                  className="transition duration-300 hover:bg-sky-400/[0.03]"
                >

                  {/* User */}

                  <td className="px-6 py-4">

                    <div className="flex items-center gap-3">

                      {avatar ? (
                        <img
                          src={avatar}
                          alt={getUserName(user)}
                          className="h-11 w-11 rounded-full border border-[#263449] object-cover"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-sky-400/20 bg-sky-400/10 text-sm font-bold text-sky-400">
                          {getUserName(user)
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0">

                        <Link
                          to={`/admin/users/${userId}`}
                          className="block truncate text-sm font-bold text-white transition hover:text-sky-400"
                        >
                          {getUserName(user)}
                        </Link>

                        <p className="max-w-[240px] truncate text-xs text-slate-400">
                          {getUserEmail(user)}
                        </p>

                      </div>

                    </div>

                  </td>

                  {/* Role */}

                  <td className="px-6 py-4">

                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${role === "admin"
                          ? "border border-sky-400/20 bg-sky-400/10 text-sky-400"
                          : "border border-[#263449] bg-[#172338] text-slate-400"
                        }`}
                    >
                      {role === "admin" ? "Admin" : "User"}
                    </span>

                  </td>

                  {/* Status */}

                  <td className="px-6 py-4">

                    <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-400">
                      Active
                    </span>

                  </td>

                  {/* Joined */}

                  <td className="px-6 py-4">

                    <span className="text-sm text-slate-400">
                      {user?.createdAt
                        ? new Date(
                          user.createdAt
                        ).toLocaleDateString()
                        : "—"}
                    </span>

                  </td>

                  {/* Actions */}

                  <td className="px-6 py-4 text-right">

                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() =>
                        handleDelete(user)
                      }
                      className="rounded-xl border border-red-400/10 px-3 py-2 text-sm font-semibold text-red-400 transition hover:border-red-400/20 hover:bg-red-400/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {isProcessing
                        ? "Processing..."
                        : "Delete"}
                    </button>

                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default UserTable;