import React, {
  useEffect,
  useState,
} from "react";

import { useParams } from "react-router-dom";

import OwnerCalendar from "../../components/ownerProperty/OwnerCalendar";

import BlockDateModal from "../../components/ownerProperty/BlockDateModal";

import {
  getOwnerPropertyCalendar,
  blockPropertyDates,
  updateBlockedDate,
  unblockDate,
} from "../../services/propertyService";

const OwnerPropertyCalendarPage = () => {

  const { propertyId } = useParams();

  const [calendarData, setCalendarData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState(null);
  const [editingBlock, setEditingBlock] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchCalendar = async () => {
    try {
      const data = await getOwnerPropertyCalendar(propertyId);
      setCalendarData(data);
    } catch (error) {
      console.log("Calendar error:", error);
    }
  };

  useEffect(() => {
    fetchCalendar();
  }, [propertyId]);

  const handleSingleDateSelect = (info) => {
    setEditingBlock(null);
    setIsEditMode(false);
    setSelectedRange({
      start: info.dateStr,
      end: info.dateStr,
    });
    setIsModalOpen(true);
  };

  const handleRangeSelect = (selectionInfo) => {
    const start = selectionInfo.startStr;
    const endDateObj = new Date(selectionInfo.endStr);
    endDateObj.setDate(endDateObj.getDate() - 1);
    const end = endDateObj.toISOString().split("T")[0];
    setEditingBlock(null);
    setIsEditMode(false);
    setSelectedRange({ start, end });
    selectionInfo.view.calendar.unselect();
    setIsModalOpen(true);
  };

  const handleBlockedDateClick = (blockData) => {
    setEditingBlock(blockData);
    setIsEditMode(true);
    setSelectedRange({
      start: blockData.date,
      end: blockData.date,
    });
    setIsModalOpen(true);
  };

  const handleBlockDates = async (formData) => {
    try {
      await blockPropertyDates(formData);
      closeModal();
      fetchCalendar();
    } catch (error) {
      console.log("Block error:", error);
    }
  };

  const handleUpdateBlock = async (formData) => {
    try {
      await updateBlockedDate(editingBlock.ids, formData);
      setIsModalOpen(false);
      setEditingBlock(null);
      setIsEditMode(false);
      fetchCalendar();
    } catch (error) {
      console.log("Update error:", error);
    }
  };

  const handleUnblock = async () => {
    try {
      await unblockDate(editingBlock.ids);
      setIsModalOpen(false);
      setEditingBlock(null);
      setIsEditMode(false);
      fetchCalendar();
    } catch (error) {
      console.log("Unblock error:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRange(null);
    setEditingBlock(null);
    setIsEditMode(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Property Calendar
          </h1>
          <p className="text-gray-500 mt-2">
            Manage your property availability and blocked dates
          </p>
        </div>

        {/* Calendar Container */}
        <div className="bg-white rounded-2xl shadow-xl p-6 backdrop-blur-sm bg-white/95">
          <OwnerCalendar
            calendarData={calendarData}
            onSingleDateSelect={handleSingleDateSelect}
            onRangeSelect={handleRangeSelect}
            onBlockedDateClick={handleBlockedDateClick}
          />
        </div>

        {/* Modal */}
        <BlockDateModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedRange(null);
            setEditingBlock(null);
            setIsEditMode(false);
          }}
          onSubmit={handleBlockDates}
          onUpdate={handleUpdateBlock}
          onUnblock={handleUnblock}
          selectedRange={selectedRange}
          propertyId={propertyId}
          editingBlock={editingBlock}
          isEditMode={isEditMode}
        />
      </div>
    </div>
  );
};

export default OwnerPropertyCalendarPage;