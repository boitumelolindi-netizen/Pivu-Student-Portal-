import { useEffect, useMemo, useState } from "react";
import { db } from "../firebase";

import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  setDoc
} from "firebase/firestore";

import { units } from "../data/units";

function AdminDashboard() {

  const [bookings, setBookings] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementMessage, setAnnouncementMessage] = useState("");

  // Stores a different move-in date for each application.
  const [moveInDates, setMoveInDates] = useState({});

  // Stores a different unit selection for each application.
  const [selectedUnits, setSelectedUnits] = useState({});

  const [loading, setLoading] = useState(true);

  /*
   * FETCH ALL ADMIN DATA
   */
  const fetchData = async () => {

    try {

      setLoading(true);

      const [
        bookingsSnapshot,
        maintenanceSnapshot,
        announcementsSnapshot
      ] = await Promise.all([

        getDocs(
          collection(db, "bookings")
        ),

        getDocs(
          collection(db, "maintenance")
        ),

        getDocs(
          collection(db, "announcements")
        )

      ]);

      const bookingsData =
        bookingsSnapshot.docs.map((document) => ({
          id: document.id,
          ...document.data()
        }));

      const maintenanceData =
        maintenanceSnapshot.docs.map((document) => ({
          id: document.id,
          ...document.data()
        }));

      const announcementsData =
        announcementsSnapshot.docs.map((document) => ({
          id: document.id,
          ...document.data()
        }));

      setBookings(bookingsData);
      setMaintenance(maintenanceData);
      setAnnouncements(announcementsData);

    } catch (error) {

      console.error(
        "Error loading admin data:",
        error
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    fetchData();

  }, []);

  /*
   * UNIT OCCUPANCY
   *
   * A unit counts as occupied only when
   * an application is Approved AND has a unit.
   */
  const occupiedUnits = useMemo(() => {

    return bookings
      .filter(
        (booking) =>
          booking.status === "Approved" &&
          booking.unitNumber
      )
      .map(
        (booking) => booking.unitNumber
      );

  }, [bookings]);

  /*
   * Remove duplicate unit numbers.
   */
  const uniqueOccupiedUnits = [
    ...new Set(occupiedUnits)
  ];

  const totalUnits = units.length;

  const occupiedCount =
    uniqueOccupiedUnits.length;

  const availableCount =
    totalUnits - occupiedCount;

  const occupancyPercentage =
    totalUnits === 0
      ? 0
      : Math.round(
          (occupiedCount / totalUnits) * 100
        );

  /*
   * AVAILABLE UNITS
   *
   * These are the units not already allocated
   * to approved students.
   */
  const availableUnits = units.filter(
    (unit) =>
      !uniqueOccupiedUnits.includes(unit)
  );

  /*
   * APPLICATION STATISTICS
   */
  const totalApplications =
    bookings.length;

  const approved =
    bookings.filter(
      (booking) =>
        booking.status === "Approved"
    ).length;

  const pending =
    bookings.filter(
      (booking) =>
        !booking.status ||
        booking.status === "Pending"
    ).length;

  const rejected =
    bookings.filter(
      (booking) =>
        booking.status === "Rejected"
    ).length;

  const nsfasStudents =
    bookings.filter(
      (booking) =>
        booking.status === "Approved" &&
        booking.nsfasFunded === "Yes"
    ).length;

  /*
   * MAINTENANCE STATISTICS
   */
  const openMaintenance =
    maintenance.filter(
      (item) =>
        item.status !== "Resolved"
    ).length;

  const resolvedMaintenance =
    maintenance.filter(
      (item) =>
        item.status === "Resolved"
    ).length;

  /*
   * SELECT UNIT
   */
  const handleUnitChange = (
    bookingId,
    unitNumber
  ) => {

    setSelectedUnits((previous) => ({
      ...previous,
      [bookingId]: unitNumber
    }));

  };

  /*
   * SELECT MOVE-IN DATE
   */
  const handleMoveInDateChange = (
    bookingId,
    date
  ) => {

    setMoveInDates((previous) => ({
      ...previous,
      [bookingId]: date
    }));

  };

  /*
   * APPROVE / REJECT APPLICATION
   */
const updateStatus = async (bookingId, newStatus) => {

  const booking = bookings.find(
    (item) => item.id === bookingId
  );

  if (!booking) {
    alert("Booking not found.");
    return;
  }

  const selectedUnit = selectedUnits[bookingId];
  const selectedMoveInDate = moveInDates[bookingId];

  if (newStatus === "Approved") {

    if (!selectedUnit) {
      alert("Please select a unit first.");
      return;
    }

    if (!selectedMoveInDate) {
      alert("Please select a move-in date first.");
      return;
    }

    const unitAlreadyOccupied = bookings.some(
      (item) =>
        item.id !== bookingId &&
        item.status === "Approved" &&
        item.unitNumber === selectedUnit
    );

    if (unitAlreadyOccupied) {
      alert("That unit is already allocated.");
      return;
    }

    try {

      // CREATE PUBLIC ACCESS PASS
      await setDoc(
        doc(db, "accessPasses", bookingId),
        {
          bookingId: bookingId,
          name: booking.name || "",
          unitNumber: selectedUnit,
          roomType: booking.roomType || "",
          moveInDate: selectedMoveInDate,
          status: "Approved"
        }
      );

      // UPDATE PRIVATE BOOKING
      await updateDoc(
        doc(db, "bookings", bookingId),
        {
          status: "Approved",
          unitNumber: selectedUnit,
          moveInDate: selectedMoveInDate
        }
      );

      setBookings((previous) =>
        previous.map((item) =>
          item.id === bookingId
            ? {
                ...item,
                status: "Approved",
                unitNumber: selectedUnit,
                moveInDate: selectedMoveInDate
              }
            : item
        )
      );

      alert(
        "Application approved and access pass created."
      );

    } catch (error) {

      console.error(
        "Access pass error:",
        error
      );

      alert(error.message);
    }

    return;
  }

  // REJECT
  try {

    await updateDoc(
      doc(db, "bookings", bookingId),
      {
        status: "Rejected",
        unitNumber: null,
        moveInDate: null
      }
    );

    setBookings((previous) =>
      previous.map((item) =>
        item.id === bookingId
          ? {
              ...item,
              status: "Rejected",
              unitNumber: null,
              moveInDate: null
            }
          : item
      )
    );

  } catch (error) {

    console.error(
      "Rejection error:",
      error
    );

    alert(error.message);
  }
};


  /*
   * CREATE ANNOUNCEMENT
   */
  const createAnnouncement = async () => {

    if (
      !announcementTitle.trim() ||
      !announcementMessage.trim()
    ) {

      alert(
        "Please enter both a title and a message."
      );

      return;
    }

    try {

      const announcementRef =
        await addDoc(
          collection(
            db,
            "announcements"
          ),
          {
            title:
              announcementTitle.trim(),

            message:
              announcementMessage.trim(),

            createdAt:
              new Date().toISOString()
          }
        );

      setAnnouncements((previous) => [

        {
          id: announcementRef.id,

          title:
            announcementTitle.trim(),

          message:
            announcementMessage.trim(),

          createdAt:
            new Date().toISOString()

        },

        ...previous

      ]);

      setAnnouncementTitle("");
      setAnnouncementMessage("");

      alert(
        "Announcement posted successfully."
      );

    } catch (error) {

      console.error(error);

      alert(
        "Unable to post announcement."
      );

    }

  };

  /*
   * DELETE ANNOUNCEMENT
   */
  const removeAnnouncement = async (
    announcementId
  ) => {

    try {

      await deleteDoc(
        doc(
          db,
          "announcements",
          announcementId
        )
      );

      setAnnouncements((previous) =>
        previous.filter(
          (announcement) =>
            announcement.id !==
            announcementId
        )
      );

    } catch (error) {

      console.error(error);

      alert(
        "Unable to delete announcement."
      );

    }

  };

  /*
   * RESOLVE MAINTENANCE
   */
  const resolveMaintenance = async (
    maintenanceId
  ) => {

    try {

      await updateDoc(

        doc(
          db,
          "maintenance",
          maintenanceId
        ),

        {
          status: "Resolved"
        }

      );

      setMaintenance((previous) =>

        previous.map((item) =>

          item.id === maintenanceId

            ? {
                ...item,
                status: "Resolved"
              }

            : item

        )

      );

    } catch (error) {

      console.error(error);

      alert(
        "Unable to update maintenance request."
      );

    }

  };

  /*
   * LOADING
   */
  if (loading) {

    return (
      <div className="dashboard-container">

        <div className="admin-loading">
          Loading admin dashboard...
        </div>

      </div>
    );

  }

  return (

    <div className="dashboard-container">

      {/* HEADER */}

      <div className="admin-header">

        <div>
          <p className="admin-eyebrow">
            Pivu Holdings Pty Ltd
          </p>

          <h1 className="dashboard-title">
            Admin Dashboard
          </h1>

          <p>
            Accommodation management overview
          </p>
        </div>

      </div>


      {/* APPLICATION STATISTICS */}

      <section>

        <h2 className="section-heading">
          Application Overview
        </h2>

        <div className="stats-grid">

          <div className="stat-card">
            <span>Total Applications</span>
            <strong>
              {totalApplications}
            </strong>
          </div>

          <div className="stat-card stat-approved">
            <span>Approved</span>
            <strong>
              {approved}
            </strong>
          </div>

          <div className="stat-card stat-pending">
            <span>Pending</span>
            <strong>
              {pending}
            </strong>
          </div>

          <div className="stat-card stat-rejected">
            <span>Rejected</span>
            <strong>
              {rejected}
            </strong>
          </div>

          <div className="stat-card stat-nsfas">
            <span>Approved NSFAS</span>
            <strong>
              {nsfasStudents}
            </strong>
          </div>

        </div>

      </section>


      {/* OCCUPANCY */}

      <section className="occupancy-section">

        <div className="section-heading-row">

          <div>
            <h2 className="section-heading">
              Unit Occupancy
            </h2>

            <p>
              {occupiedCount} of {totalUnits} units
              currently allocated
            </p>
          </div>

          <div className="occupancy-percentage">
            {occupancyPercentage}%
          </div>

        </div>

        <div className="occupancy-bar">

          <div
            className="occupancy-fill"
            style={{
              width:
                `${occupancyPercentage}%`
            }}
          />

        </div>

        <div className="occupancy-summary">

          <div>
            <span>Total Units</span>
            <strong>
              {totalUnits}
            </strong>
          </div>

          <div>
            <span>Occupied</span>
            <strong>
              {occupiedCount}
            </strong>
          </div>

          <div>
            <span>Available</span>
            <strong>
              {availableCount}
            </strong>
          </div>

        </div>

      </section>


      {/* UNIT MAP */}

      <section>

        <h2 className="section-heading">
          Unit Availability
        </h2>

        <div className="unit-grid">

          {units.map((unit) => {

            const occupied =
              uniqueOccupiedUnits.includes(
                unit
              );

            return (

              <div
                key={unit}
                className={
                  occupied
                    ? "unit-card unit-occupied"
                    : "unit-card unit-available"
                }
              >

                <strong>
                  {unit}
                </strong>

                <span>
                  {occupied
                    ? "Occupied"
                    : "Available"}
                </span>

              </div>

            );

          })}

        </div>

      </section>


      {/* APPLICATIONS */}

      <section>

        <h2 className="section-heading">
          Applications
        </h2>

        {bookings.length === 0 ? (

          <div className="empty-state">
            No applications yet.
          </div>

        ) : (

          bookings.map((booking) => {

            const currentSelectedUnit =
              selectedUnits[booking.id] ||
              booking.unitNumber ||
              "";

            const currentMoveInDate =
              moveInDates[booking.id] ||
              booking.moveInDate ||
              "";

            /*
             * If the booking already has a unit,
             * keep it available for that same booking.
             */
            const unitOptions =
              availableUnits.includes(
                currentSelectedUnit
              )
                ? availableUnits
                : [
                    currentSelectedUnit,
                    ...availableUnits
                  ];

            return (

              <div
                key={booking.id}
                className="booking-card admin-application-card"
              >

                <div className="application-header">

                  <div>

                    <h3>
                      {booking.name}
                    </h3>

                    <p>
                      Application ID:
                      {" "}
                      {booking.id}
                    </p>

                  </div>

                  <span
                    className={
                      booking.status ===
                      "Approved"

                        ? "status-approved"

                        : booking.status ===
                          "Rejected"

                        ? "status-rejected"

                        : "status-pending"
                    }
                  >
                    {booking.status ||
                      "Pending"}
                  </span>

                </div>


                <div className="application-details">

                  <p>
                    <strong>
                      Email:
                    </strong>
                    {" "}
                    {booking.email}
                  </p>

                  <p>
                    <strong>
                      Phone:
                    </strong>
                    {" "}
                    {booking.phone}
                  </p>

                  <p>
                    <strong>
                      Student Number:
                    </strong>
                    {" "}
                    {booking.studentNumber}
                  </p>

                  <p>
                    <strong>
                      Institution:
                    </strong>
                    {" "}
                    {booking.institution}
                  </p>

                  <p>
                    <strong>
                      NSFAS:
                    </strong>
                    {" "}
                    {booking.nsfasFunded}
                  </p>

                  <p>
                    <strong>
                      Room Type:
                    </strong>
                    {" "}
                    {booking.roomType}
                  </p>

                </div>


                {/* ALLOCATION */}

                <div className="allocation-panel">

                  <h4>
                    Room Allocation
                  </h4>

                  <div className="allocation-fields">

                    <div>

                      <label>
                        Unit
                      </label>

                      <select
                        value={
                          currentSelectedUnit
                        }
                        onChange={(event) =>
                          handleUnitChange(
                            booking.id,
                            event.target.value
                          )
                        }
                        disabled={
                          booking.status ===
                          "Approved"
                        }
                      >

                        <option value="">
                          Select Unit
                        </option>

                        {unitOptions.map(
                          (unit) => (

                            <option
                              key={unit}
                              value={unit}
                            >
                              {unit}
                              {unit.startsWith(
                                "UNIT-"
                              )
                                ? " (placeholder)"
                                : ""}
                            </option>

                          )
                        )}

                      </select>

                    </div>


                    <div>

                      <label>
                        Move-In Date
                      </label>

                      <input
                        type="date"
                        value={
                          currentMoveInDate
                        }
                        onChange={(event) =>
                          handleMoveInDateChange(
                            booking.id,
                            event.target.value
                          )
                        }
                      />

                    </div>

                  </div>

                  {booking.unitNumber && (

                    <p className="allocated-note">

                      Allocated Unit:
                      {" "}
                      <strong>
                        {booking.unitNumber}
                      </strong>

                    </p>

                  )}

                </div>


                {/* ACTIONS */}

                <div className="admin-buttons">

                  {booking.status !==
                    "Approved" && (

                    <button
                      className="approve-btn"
                      onClick={() =>
                        updateStatus(
                          booking.id,
                          "Approved"
                        )
                      }
                    >
                      Approve & Allocate
                    </button>

                  )}

                  {booking.status !==
                    "Rejected" && (

                    <button
                      className="reject-btn"
                      onClick={() =>
                        updateStatus(
                          booking.id,
                          "Rejected"
                        )
                      }
                    >
                      Reject
                    </button>

                  )}

                </div>

              </div>

            );

          })

        )}

      </section>


      {/* ANNOUNCEMENTS */}

      <section>

        <h2 className="section-heading">
          📢 Announcements
        </h2>

        <div className="booking-card">

          <h3>
            Post New Announcement
          </h3>

          <input
            type="text"
            className="admin-input"
            placeholder="Announcement title"
            value={
              announcementTitle
            }
            onChange={(event) =>
              setAnnouncementTitle(
                event.target.value
              )
            }
          />

          <textarea
            className="admin-input"
            placeholder="Announcement message"
            rows="5"
            value={
              announcementMessage
            }
            onChange={(event) =>
              setAnnouncementMessage(
                event.target.value
              )
            }
          />

          <button
            className="approve-btn"
            onClick={
              createAnnouncement
            }
          >
            Post Announcement
          </button>

        </div>


        {announcements.map(
          (announcement) => (

            <div
              key={announcement.id}
              className="announcement-card"
            >

              <div>

                <h3>
                  {announcement.title}
                </h3>

                <p>
                  {announcement.message}
                </p>

              </div>

              <button
                className="delete-btn"
                onClick={() =>
                  removeAnnouncement(
                    announcement.id
                  )
                }
              >
                Delete
              </button>

            </div>

          )
        )}

      </section>


      {/* MAINTENANCE */}

      <section>

        <h2 className="section-heading">
          🛠 Maintenance
        </h2>

        <div className="stats-grid maintenance-stats">

          <div className="stat-card stat-pending">
            <span>Open Issues</span>
            <strong>
              {openMaintenance}
            </strong>
          </div>

          <div className="stat-card stat-approved">
            <span>Resolved</span>
            <strong>
              {resolvedMaintenance}
            </strong>
          </div>

        </div>


        {maintenance.length === 0 ? (

          <div className="empty-state">
            No maintenance requests.
          </div>

        ) : (

          maintenance.map((item) => (

            <div
              key={item.id}
              className="booking-card"
            >

              <h3>
                Room{" "}
                {item.roomNumber}
              </h3>

              <p>
                <strong>
                  Priority:
                </strong>
                {" "}
                {item.priority}
              </p>

              <p>
                <strong>
                  Issue:
                </strong>
                {" "}
                {item.issue}
              </p>

              <p>
                <strong>
                  Status:
                </strong>
                {" "}
                {item.status}
              </p>

              {item.status !==
                "Resolved" && (

                <button
                  className="approve-btn"
                  onClick={() =>
                    resolveMaintenance(
                      item.id
                    )
                  }
                >
                  Mark Resolved
                </button>

              )}

            </div>

          ))

        )}

      </section>

    </div>

  );
}

export default AdminDashboard;