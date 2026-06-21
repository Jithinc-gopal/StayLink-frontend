// src/pages/Broker/BrokerNotes.jsx

import { useEffect, useMemo, useState } from "react";
import BrokerLayout from "../../components/BrokerComponents/BrokerLayout";
import {
  getBrokerNotes,
  createBrokerNote,
  updateBrokerNote,
  deleteBrokerNote,
  toggleBrokerNotePin,
} from "../../services/brokerService";

import {
  StickyNote,
  Plus,
  Search,
  RefreshCw,
  AlertCircle,
  Pin,
  PinOff,
  Pencil,
  Trash2,
  X,
  Save,
  Filter,
  Building2,
} from "lucide-react";

const initialForm = {
  title: "",
  content: "",
  category: "general",
  property: "",
};

export default function BrokerNotes() {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("");
  const [pinned, setPinned] = useState("");
  const [propertyId, setPropertyId] = useState("");

  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        category: category || undefined,
        pinned: pinned === "" ? undefined : pinned,
        propertyId: propertyId || undefined,
      };

      const res = await getBrokerNotes(params);
      setNotes(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load notes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [category, pinned, propertyId]);

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const text = `${note.title || ""} ${note.content || ""} ${
        note.category || ""
      } ${note.property?.title || ""}`.toLowerCase();

      return text.includes(search.toLowerCase());
    });
  }, [notes, search]);

  const pinnedCount = useMemo(() => {
    return notes.filter((note) => note.pinned || note.is_pinned).length;
  }, [notes]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setError("Please enter a note title.");
      return;
    }

    if (!form.content.trim()) {
      setError("Please enter note content.");
      return;
    }

    try {
      setSubmitLoading(true);
      setError("");

      const payload = {
        title: form.title,
        content: form.content,
        category: form.category,
      };

      if (form.property) {
        payload.property = form.property;
      }

      if (editingId) {
        await updateBrokerNote(editingId, payload);
      } else {
        await createBrokerNote(payload);
      }

      resetForm();
      fetchNotes();
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.detail ||
          "Failed to save note. Please check the fields."
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (note) => {
    setEditingId(note.id);

    setForm({
      title: note.title || "",
      content: note.content || "",
      category: note.category || "general",
      property: note.property?.id || note.property || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmDelete) return;

    try {
      setActionLoading(id);
      setError("");

      await deleteBrokerNote(id);
      fetchNotes();
    } catch (err) {
      console.error(err);
      setError("Failed to delete note.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleTogglePin = async (id) => {
    try {
      setActionLoading(id);
      setError("");

      await toggleBrokerNotePin(id);
      fetchNotes();
    } catch (err) {
      console.error(err);
      setError("Failed to update pin status.");
    } finally {
      setActionLoading(null);
    }
  };

  const clearFilters = () => {
    setCategory("");
    setPinned("");
    setPropertyId("");
    setSearch("");
  };

  const isPinned = (note) => note.pinned || note.is_pinned;

  return (
    <BrokerLayout>
      <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Broker Notes
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Create, manage, pin, update, and organize your broker notes.
            </p>
          </div>

          <button
            onClick={fetchNotes}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Notes</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-900">
                  {notes.length}
                </h3>
              </div>
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <StickyNote size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Pinned Notes</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-900">
                  {pinnedCount}
                </h3>
              </div>
              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <Pin size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Current Category</p>
                <h3 className="mt-2 text-lg font-semibold capitalize text-slate-900">
                  {category || "All"}
                </h3>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <Filter size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 p-5">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                    <div>
                      <h2 className="font-semibold text-slate-900">
                        Notes List
                      </h2>
                      <p className="text-sm text-slate-500">
                        Search and filter your saved notes.
                      </p>
                    </div>

                    <div className="relative w-full lg:w-80">
                      <Search
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search notes..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm outline-none focus:border-slate-400 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:bg-white"
                    >
                      <option value="">All Categories</option>
                      <option value="general">General</option>
                      <option value="property">Property</option>
                      <option value="client">Client</option>
                      <option value="follow_up">Follow Up</option>
                      <option value="important">Important</option>
                    </select>

                    <select
                      value={pinned}
                      onChange={(e) => setPinned(e.target.value)}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:bg-white"
                    >
                      <option value="">All Notes</option>
                      <option value="true">Pinned Only</option>
                      <option value="false">Unpinned Only</option>
                    </select>

                    <input
                      value={propertyId}
                      onChange={(e) => setPropertyId(e.target.value)}
                      placeholder="Property ID"
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:bg-white"
                    />

                    <button
                      onClick={clearFilters}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-5">
                {loading ? (
                  <div className="flex min-h-[300px] items-center justify-center">
                    <div className="text-center">
                      <RefreshCw className="mx-auto mb-3 animate-spin text-slate-400" />
                      <p className="text-sm text-slate-500">
                        Loading notes...
                      </p>
                    </div>
                  </div>
                ) : filteredNotes.length === 0 ? (
                  <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                    <div className="mb-4 rounded-full bg-slate-100 p-4 text-slate-400">
                      <StickyNote size={32} />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      No notes found
                    </h3>
                    <p className="mt-1 max-w-sm text-sm text-slate-500">
                      Create your first broker note or change the filters.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredNotes.map((note) => (
                      <div
                        key={note.id}
                        className={`rounded-2xl border bg-white p-5 transition hover:shadow-sm ${
                          isPinned(note)
                            ? "border-amber-200"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-start">
                          <div>
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <h3 className="text-lg font-semibold text-slate-900">
                                {note.title}
                              </h3>

                              {isPinned(note) && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                                  <Pin size={12} />
                                  Pinned
                                </span>
                              )}

                              {note.category && (
                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-600">
                                  {note.category.replace("_", " ")}
                                </span>
                              )}
                            </div>

                            {note.property?.title && (
                              <p className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                                <Building2 size={14} />
                                {note.property.title}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleTogglePin(note.id)}
                              disabled={actionLoading === note.id}
                              className="rounded-xl border border-amber-100 bg-amber-50 p-2 text-amber-600 hover:bg-amber-100 disabled:opacity-60"
                              title={isPinned(note) ? "Unpin note" : "Pin note"}
                            >
                              {isPinned(note) ? (
                                <PinOff size={16} />
                              ) : (
                                <Pin size={16} />
                              )}
                            </button>

                            <button
                              onClick={() => handleEdit(note)}
                              className="rounded-xl border border-blue-100 bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                              title="Edit note"
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              onClick={() => handleDelete(note.id)}
                              disabled={actionLoading === note.id}
                              className="rounded-xl border border-red-100 bg-red-50 p-2 text-red-600 hover:bg-red-100 disabled:opacity-60"
                              title="Delete note"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        <p className="whitespace-pre-line rounded-xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
                          {note.content}
                        </p>

                        {(note.created_at || note.updated_at) && (
                          <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
                            {note.created_at && (
                              <span>
                                Created:{" "}
                                {new Date(note.created_at).toLocaleDateString()}
                              </span>
                            )}

                            {note.updated_at && (
                              <span>
                                Updated:{" "}
                                {new Date(note.updated_at).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  {editingId ? <Pencil size={22} /> : <Plus size={22} />}
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    {editingId ? "Update Note" : "Create Note"}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {editingId
                      ? "Edit selected broker note."
                      : "Add a new note for your workflow."}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Title
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Enter note title"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Category
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:bg-white"
                  >
                    <option value="general">General</option>
                    <option value="property">Property</option>
                    <option value="client">Client</option>
                    <option value="follow_up">Follow Up</option>
                    <option value="important">Important</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Property ID
                  </label>
                  <input
                    name="property"
                    value={form.property}
                    onChange={handleChange}
                    placeholder="Optional property ID"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Content
                  </label>
                  <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    rows="7"
                    placeholder="Write note details..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                >
                  {submitLoading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      {editingId ? "Update Note" : "Create Note"}
                    </>
                  )}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    <X size={16} />
                    Cancel Edit
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </BrokerLayout>
  );
}