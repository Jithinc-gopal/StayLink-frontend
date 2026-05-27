import React, {
  useEffect,
  useState,
} from "react";

const BlockDateModal = ({
  isOpen,
  onClose,
  onSubmit,
  onUpdate,
  onUnblock,
  selectedRange,
  propertyId,
  editingBlock,
  isEditMode,
}) => {

  const [blockType, setBlockType] = useState("manual_block");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (isEditMode && editingBlock) {
      setBlockType(editingBlock.block_type || "manual_block");
      setNote(editingBlock.note || "");
    } else {
      setBlockType("manual_block");
      setNote("");
    }
  }, [editingBlock, isEditMode]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async () => {
    const payload = {
      property_id: propertyId,
      start_date: selectedRange.start,
      end_date: selectedRange.end,
      block_type: blockType,
      note,
    };

    try {
      if (isEditMode && editingBlock) {
        await onUpdate(payload);
      } else {
        await onSubmit(payload);
      }
    } catch (error) {
      console.log("Modal submit error:", error);
    }
  };

  const handleUnblock = async () => {
    try {
      await onUnblock(editingBlock.ids);
    } catch (error) {
      console.log("Unblock modal error:", error);
    }
  };

  const getBlockTypeIcon = () => {
    switch(blockType) {
      case "maintenance": return "🔧";
      case "leave": return "🏖️";
      default: return "🚫";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all animate-in slide-in-from-bottom-4 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {isEditMode ? "Edit Block" : "Block Dates"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {isEditMode ? "Modify or remove this block" : "Mark dates as unavailable"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Date Range Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Selected Date Range</p>
            </div>
            <p className="font-bold text-gray-800 text-lg">
              {selectedRange?.start === selectedRange?.end
                ? selectedRange?.start
                : `${selectedRange?.start} → ${selectedRange?.end}`}
            </p>
            {selectedRange?.start !== selectedRange?.end && (
              <p className="text-xs text-blue-600 mt-1">
                {Math.ceil((new Date(selectedRange.end) - new Date(selectedRange.start)) / (1000 * 60 * 60 * 24)) + 1} days
              </p>
            )}
          </div>

          {/* Block Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Block Type
            </label>
            <div className="relative">
              <select
                value={blockType}
                onChange={(e) => setBlockType(e.target.value)}
                className="w-full appearance-none border border-gray-200 rounded-xl p-3 pr-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-white"
              >
                <option value="manual_block">🚫 Manual Block</option>
                <option value="leave">🏖️ Leave / Vacation</option>
                <option value="maintenance">🔧 Maintenance</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                ▼
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {blockType === "maintenance" && "Property under repair or renovation"}
              {blockType === "leave" && "Owner on leave / vacation"}
              {blockType === "manual_block" && "Manually blocked for other reasons"}
            </p>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Note <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Add a note or reason..."
              className="w-full border border-gray-200 rounded-xl p-3 resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 pt-0 flex gap-3">
          {isEditMode && (
            <button
              onClick={handleUnblock}
              className="flex-1 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-semibold transition-all duration-200 border border-red-200 hover:border-red-300"
            >
              🗑️ Unblock
            </button>
          )}
          
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold transition-all duration-200"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-900 hover:to-gray-800 text-white font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {isEditMode ? "✓ Update" : "✓ Block"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockDateModal;