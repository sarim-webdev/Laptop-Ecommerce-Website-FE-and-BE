import { useEffect, useState } from "react";

import contactService from "../../services/contactService";
import Loader from "../../components/common/Loader";


/* =========================================
   ADMIN CONTACTS
========================================= */

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedContact, setSelectedContact] =
    useState(null);

  const [refreshing, setRefreshing] = useState(false);


  /* =========================================
     FETCH CONTACTS
  ========================================= */

  const fetchContacts = async () => {
    try {
      setError("");

      const response =
        await contactService.getContacts();

      const contactsData =
        response?.data?.contacts ||
        response?.contacts ||
        response?.data ||
        [];

      setContacts(
        Array.isArray(contactsData)
          ? contactsData
          : []
      );
    } catch (error) {
      console.error(
        "Failed to fetch contacts:",
        error
      );

      setError(
        error?.response?.data?.message ||
        "Failed to load contact messages."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  /* =========================================
     INITIAL LOAD
  ========================================= */

  useEffect(() => {
    fetchContacts();
  }, []);


  /* =========================================
     REFRESH
  ========================================= */

  const handleRefresh = () => {
    setRefreshing(true);
    fetchContacts();
  };


  /* =========================================
     UPDATE STATUS
  ========================================= */

  const handleStatusChange = async (
    contactId,
    status
  ) => {
    try {
      const response =
        await contactService.updateContactStatus(
          contactId,
          { status }
        );

      const updatedContact =
        response?.data?.contact ||
        response?.contact;

      if (updatedContact) {
        setContacts((currentContacts) =>
          currentContacts.map((contact) =>
            contact._id === contactId
              ? updatedContact
              : contact
          )
        );

        if (
          selectedContact?._id === contactId
        ) {
          setSelectedContact(updatedContact);
        }
      } else {
        await fetchContacts();
      }
    } catch (error) {
      console.error(
        "Failed to update contact status:",
        error
      );

      setError(
        error?.response?.data?.message ||
        "Failed to update contact status."
      );
    }
  };


  /* =========================================
     DELETE CONTACT
  ========================================= */

  const handleDelete = async (contactId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this contact message?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await contactService.deleteContact(
        contactId
      );

      setContacts((currentContacts) =>
        currentContacts.filter(
          (contact) =>
            contact._id !== contactId
        )
      );

      if (
        selectedContact?._id === contactId
      ) {
        setSelectedContact(null);
      }
    } catch (error) {
      console.error(
        "Failed to delete contact:",
        error
      );

      setError(
        error?.response?.data?.message ||
        "Failed to delete contact message."
      );
    }
  };


  /* =========================================
     STATUS BADGE
  ========================================= */

  const getStatusClasses = (status) => {
    switch (status) {
      case "Resolved":
        return "border-emerald-400/20 bg-emerald-400/10 text-emerald-400";

      case "In Progress":
        return "border-blue-400/20 bg-blue-400/10 text-blue-400";

      case "Closed":
        return "border-slate-400/20 bg-slate-400/10 text-slate-400";

      default:
        return "border-amber-400/20 bg-amber-400/10 text-amber-400";
    }
  };


  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#05080d] text-white">
        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-cyan-400" />

          <p className="mt-4 text-sm text-slate-500">
            Loading contacts...
          </p>

        </div>
      </div>
    );
  }


  /* =========================================
     PAGE
  ========================================= */

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#05080d] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-8">

      {/* =====================================
          BACKGROUND GLOWS
      ===================================== */}

      <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-cyan-500/[0.06] blur-3xl" />

      <div className="pointer-events-none absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-blue-600/[0.05] blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-cyan-500/[0.03] blur-3xl" />


      <div className="relative mx-auto max-w-7xl space-y-6">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <span className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
              NEXORA ADMINISTRATION
            </span>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Contact Messages
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Manage customer inquiries and support
              messages.
            </p>

          </div>


          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="rounded-xl border border-white/10 bg-[#0b1119] px-5 py-2.5 text-sm font-semibold text-slate-300 shadow-lg shadow-black/20 transition-all duration-300 hover:border-cyan-400/30 hover:bg-[#101923] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {refreshing
              ? "Refreshing..."
              : "↻ Refresh"}
          </button>

        </div>


        {/* =====================================
            ERROR
        ===================================== */}

        {error && (
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3">

            <p className="text-sm font-medium text-red-400">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchContacts}
              className="shrink-0 text-sm font-semibold text-red-400 underline"
            >
              Retry
            </button>

          </div>
        )}


        {/* =====================================
            STATS
        ===================================== */}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {/* Total */}

          <div className="group rounded-2xl border border-white/10 bg-gradient-to-br from-[#0c131d] via-[#091019] to-[#05080d] p-5 shadow-xl shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30">

            <p className="text-sm font-medium text-slate-500">
              Total Messages
            </p>

            <p className="mt-2 text-3xl font-black text-white">
              {contacts.length}
            </p>

            <div className="mt-4 h-1 w-12 rounded-full bg-cyan-400" />

          </div>


          {/* New */}

          <div className="group rounded-2xl border border-white/10 bg-gradient-to-br from-[#0c131d] via-[#091019] to-[#05080d] p-5 shadow-xl shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/30">

            <p className="text-sm font-medium text-slate-500">
              New
            </p>

            <p className="mt-2 text-3xl font-black text-amber-400">
              {
                contacts.filter(
                  (contact) =>
                    contact.status === "New" ||
                    !contact.status
                ).length
              }
            </p>

            <div className="mt-4 h-1 w-12 rounded-full bg-amber-400" />

          </div>


          {/* In Progress */}

          <div className="group rounded-2xl border border-white/10 bg-gradient-to-br from-[#0c131d] via-[#091019] to-[#05080d] p-5 shadow-xl shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/30">

            <p className="text-sm font-medium text-slate-500">
              In Progress
            </p>

            <p className="mt-2 text-3xl font-black text-blue-400">
              {
                contacts.filter(
                  (contact) =>
                    contact.status ===
                    "In Progress"
                ).length
              }
            </p>

            <div className="mt-4 h-1 w-12 rounded-full bg-blue-400" />

          </div>


          {/* Resolved */}

          <div className="group rounded-2xl border border-white/10 bg-gradient-to-br from-[#0c131d] via-[#091019] to-[#05080d] p-5 shadow-xl shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/30">

            <p className="text-sm font-medium text-slate-500">
              Resolved
            </p>

            <p className="mt-2 text-3xl font-black text-emerald-400">
              {
                contacts.filter(
                  (contact) =>
                    contact.status ===
                    "Resolved"
                ).length
              }
            </p>

            <div className="mt-4 h-1 w-12 rounded-full bg-emerald-400" />

          </div>

        </div>


        {/* =====================================
            CONTACTS TABLE
        ===================================== */}

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c131d] via-[#091019] to-[#05080d] shadow-2xl shadow-black/30">

          {/* Table Header */}

          <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

            <div>

              <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">
                Customer Support
              </span>

              <h2 className="mt-1 text-lg font-bold text-white">
                All Contact Messages
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Review and manage customer inquiries.
              </p>

            </div>

            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-400">
              {contacts.length}
            </span>

          </div>


          {contacts.length === 0 ? (

            <div className="px-6 py-16 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-[#070c12] text-2xl shadow-lg">
                ✉️
              </div>

              <h2 className="mt-5 text-lg font-bold text-white">
                No contact messages
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Customer messages will appear here.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="min-w-full">

                <thead className="border-b border-white/10 bg-white/[0.02]">

                  <tr>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Subject
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Date
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-white/[0.06]">

                  {contacts.map((contact) => (

                    <tr
                      key={contact._id}
                      className="transition duration-300 hover:bg-white/[0.025]"
                    >

                      {/* Customer */}

                      <td className="whitespace-nowrap px-6 py-5">

                        <div>

                          <p className="font-semibold text-white">
                            {contact.name ||
                              "Unknown"}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            {contact.email || "—"}
                          </p>

                        </div>

                      </td>


                      {/* Subject */}

                      <td className="max-w-xs px-6 py-5">

                        <p className="truncate text-sm font-medium text-slate-300">
                          {contact.subject ||
                            "No subject"}
                        </p>

                      </td>


                      {/* Status */}

                      <td className="whitespace-nowrap px-6 py-5">

                        <select
                          value={
                            contact.status ||
                            "New"
                          }
                          onChange={(event) =>
                            handleStatusChange(
                              contact._id,
                              event.target.value
                            )
                          }
                          className={`rounded-full border px-3 py-1.5 text-xs font-semibold outline-none transition focus:ring-2 focus:ring-cyan-400/20 ${getStatusClasses(
                            contact.status
                          )}`}
                        >

                          <option value="New">
                            New
                          </option>

                          <option value="In Progress">
                            In Progress
                          </option>

                          <option value="Resolved">
                            Resolved
                          </option>

                          <option value="Closed">
                            Closed
                          </option>

                        </select>

                      </td>


                      {/* Date */}

                      <td className="whitespace-nowrap px-6 py-5 text-sm text-slate-500">

                        {contact.createdAt
                          ? new Date(
                              contact.createdAt
                            ).toLocaleDateString()
                          : "—"}

                      </td>


                      {/* Actions */}

                      <td className="whitespace-nowrap px-6 py-5 text-right">

                        <div className="flex justify-end gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              setSelectedContact(
                                contact
                              )
                            }
                            className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-400"
                          >
                            View
                          </button>


                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                contact._id
                              )
                            }
                            className="rounded-lg border border-red-400/10 bg-red-400/10 px-3 py-2 text-xs font-semibold text-red-400 transition hover:border-red-400/30 hover:bg-red-400/20"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>


        {/* =====================================
            CONTACT DETAILS MODAL
        ===================================== */}

        {selectedContact && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">

            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c131d] via-[#091019] to-[#05080d] shadow-2xl shadow-black/60">

              {/* Modal Header */}

              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

                <div>

                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">
                    NEXORA SUPPORT
                  </span>

                  <h2 className="mt-1 text-lg font-bold text-white">
                    Contact Details
                  </h2>

                  <p className="text-sm text-slate-500">
                    Customer inquiry
                  </p>

                </div>


                <button
                  type="button"
                  onClick={() =>
                    setSelectedContact(null)
                  }
                  className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-slate-500 transition hover:border-red-400/20 hover:bg-red-400/10 hover:text-red-400"
                >
                  ✕
                </button>

              </div>


              {/* Modal Body */}

              <div className="space-y-6 px-6 py-6">

                <div className="grid gap-5 sm:grid-cols-2">

                  {/* Name */}

                  <div className="rounded-2xl border border-white/10 bg-[#070c12] p-4">

                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Name
                    </p>

                    <p className="mt-2 font-semibold text-white">
                      {selectedContact.name ||
                        "—"}
                    </p>

                  </div>


                  {/* Email */}

                  <div className="rounded-2xl border border-white/10 bg-[#070c12] p-4">

                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Email
                    </p>

                    <p className="mt-2 break-all font-semibold text-white">
                      {selectedContact.email ||
                        "—"}
                    </p>

                  </div>

                </div>


                {/* Subject */}

                <div>

                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Subject
                  </p>

                  <p className="mt-2 font-semibold text-white">
                    {selectedContact.subject ||
                      "No subject"}
                  </p>

                </div>


                {/* Message */}

                <div>

                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Message
                  </p>

                  <div className="mt-2 rounded-2xl border border-white/10 bg-[#070c12] p-5 text-sm leading-7 text-slate-300">
                    {selectedContact.message ||
                      "No message available."}
                  </div>

                </div>


                {/* Status */}

                <div>

                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </p>

                  <span
                    className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                      selectedContact.status
                    )}`}
                  >
                    {selectedContact.status ||
                      "New"}
                  </span>

                </div>

              </div>


              {/* Modal Footer */}

              <div className="flex justify-end border-t border-white/10 px-6 py-4">

                <button
                  type="button"
                  onClick={() =>
                    setSelectedContact(null)
                  }
                  className="rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/10 transition hover:bg-cyan-400"
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        )}

      </div>

    </section>
  );
};


export default AdminContacts;