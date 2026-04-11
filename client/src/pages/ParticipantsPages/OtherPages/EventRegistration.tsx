import React, { useState, useEffect } from "react";
import { Event, Participant, Profile } from "../../../components/TS_Exp/types";
import { getEventCategory } from "../../../server/events.server";
import { updateUserInformation } from "../../../server/userInfo";
import { proceedToPay } from "../../../server/payments";

interface EventRegistrationProps {
  userProfile: Profile;
  onUpdateProfile: (updatedProfile: Partial<Profile>) => void;
}

const OFFER_DEADLINE = new Date("2026-04-24T23:59:59");

const getAllEvents = (eventCategories: { [key: string]: Event[] }): Event[] => {
  return Object.values(eventCategories).flat();
};

const EventRegistration: React.FC<EventRegistrationProps> = ({
  userProfile,
  onUpdateProfile,
}) => {
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [selectedEventsWithAmt, setSelectedEventsWithAmt] = useState<
    { eventId: string; amount: number; max: number }[]
  >([]);
  const [participants, setParticipants] = useState<
    Record<string, Record<string, Participant[]>>
  >({});
  const [teams, setTeams] = useState<Record<string, string[]>>({});
  const [editMode, setEditMode] = useState<Record<string, Record<string, boolean>>>({});
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);
  const [orderData, setOrderData] = useState<{
    orderNo: number;
    amount: number;
    razorpayOrderId: string;
  } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [profileForm, setProfileForm] = useState({
    phone: userProfile.phone || "",
    college: userProfile.college || "",
  });
  const [eventCategories, setEventCategories] = useState<{
    [key: string]: Event[];
  }>({
    Technical: [],
    Cultural: [],
    Gaming: [],
  });
  const [userAddedToEvent, setUserAddedToEvent] = useState<Record<string, boolean>>({});
  const [isContingent, setIsContingent] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const [technical, gaming, cultural] = await Promise.all([
          getEventCategory("technical"),
          getEventCategory("gaming"),
          getEventCategory("cultural"),
        ]);

        setEventCategories({
          Technical: technical || [],
          Cultural: cultural || [],
          Gaming: gaming || [],
        });
      } catch (error) {
        console.error("Error fetching event categories:", error);
      }
    };

    getData();
  }, []);

  // ─── OFFER LOGIC ────────────────────────────────────────────────────────────

  const checkFullCategorySelected = (category: string) => {
    const categoryEvents = eventCategories[category] || [];
    const categoryEventIds = categoryEvents.map((e) => e.eventID);
    return (
      categoryEventIds.length > 0 &&
      categoryEventIds.every((id) => selectedEvents.includes(id!))
    );
  };

  const calculateEventTotal = (eventId: string) => {
    const event = getAllEvents(eventCategories).find((e) => e.eventID === eventId);
    const teamCount = teams[eventId]?.length || 0;
    return teamCount * (event?.registrationFee || 0);
  };

  /**
   * Returns { total, appliedOffers } so we can show the user what discounts
   * were applied AND pass the final amount to the backend.
   */
  const calculateTotalAmountWithDetails = (): {
    total: number;
    isContingentOffer: boolean;
    isTechnicalOffer: boolean;
    isGamingOffer: boolean;
    isCulturalOffer: boolean;
    offerActive: boolean;
  } => {
    const now = new Date();
    const offerActive = now <= OFFER_DEADLINE;

    // After deadline → full price, no offers
    if (!offerActive) {
      return {
        total: selectedEvents.reduce(
          (sum, eventId) => sum + calculateEventTotal(eventId),
          0
        ),
        isContingentOffer: false,
        isTechnicalOffer: false,
        isGamingOffer: false,
        isCulturalOffer: false,
        offerActive: false,
      };
    }

    // Contingent offer (all events selected via button)
    if (isContingent) {
      return {
        total: 2600,
        isContingentOffer: true,
        isTechnicalOffer: false,
        isGamingOffer: false,
        isCulturalOffer: false,
        offerActive: true,
      };
    }

    // Category-level offers
    const isAllTechnical = checkFullCategorySelected("Technical");
    const isAllGaming = checkFullCategorySelected("Gaming");
    const isAllCultural = checkFullCategorySelected("Cultural");

    let total = 0;

    if (isAllTechnical) {
      total += 900;
    } else {
      const techIds = eventCategories.Technical.map((e) => e.eventID);
      total += selectedEvents
        .filter((id) => techIds.includes(id))
        .reduce((sum, id) => sum + calculateEventTotal(id), 0);
    }

    if (isAllGaming) {
      total += 700;
    } else {
      const gamingIds = eventCategories.Gaming.map((e) => e.eventID);
      total += selectedEvents
        .filter((id) => gamingIds.includes(id))
        .reduce((sum, id) => sum + calculateEventTotal(id), 0);
    }

    if (isAllCultural) {
      total += 1000;
    } else {
      const culturalIds = eventCategories.Cultural.map((e) => e.eventID);
      total += selectedEvents
        .filter((id) => culturalIds.includes(id))
        .reduce((sum, id) => sum + calculateEventTotal(id), 0);
    }

    return {
      total,
      isContingentOffer: false,
      isTechnicalOffer: isAllTechnical,
      isGamingOffer: isAllGaming,
      isCulturalOffer: isAllCultural,
      offerActive: true,
    };
  };

  // Convenience wrapper used in JSX
  const calculateTotalAmount = () => calculateTotalAmountWithDetails().total;

  // ─── EVENT SELECTION ────────────────────────────────────────────────────────

  const handleEventToggle = (eventId: string, amount: number, max: number) => {
    setSelectedEvents((prevIds) =>
      prevIds.includes(eventId)
        ? prevIds.filter((id) => id !== eventId)
        : [...prevIds, eventId]
    );

    setSelectedEventsWithAmt((prevEvents) =>
      prevEvents.some((event) => event.eventId === eventId)
        ? prevEvents.filter((event) => event.eventId !== eventId)
        : [...prevEvents, { eventId, amount, max }]
    );
    setIsContingent(false);
  };

  const handleContingentClick = () => {
    const allEventIds = getAllEvents(eventCategories)
      .filter((event) => event.eventID)
      .map((event) => ({
        eventId: event.eventID!,
        amount: event.registrationFee!,
        max: event.maximumNoOfParticipants!,
      }));

    setSelectedEvents(allEventIds.map((event) => event.eventId));
    setSelectedEventsWithAmt(allEventIds);

    const newTeams: Record<string, string[]> = {};
    const newEditMode: Record<string, Record<string, boolean>> = {};
    const newParticipants: Record<string, Record<string, Participant[]>> = {};

    allEventIds.forEach((event) => {
      const eventId = event.eventId;
      const teamId = `Team 1-${eventId}`;
      newTeams[eventId] = [teamId];
      newEditMode[eventId] = { [teamId]: true };
      newParticipants[eventId] = { [teamId]: [] };
    });

    setTeams(newTeams);
    setEditMode(newEditMode);
    setParticipants(newParticipants);
    setUserAddedToEvent(
      allEventIds.reduce((acc, event) => {
        acc[event.eventId] = false;
        return acc;
      }, {} as Record<string, boolean>)
    );
    setIsContingent(true);
    setShowDetails(true);
  };

  // ─── PROFILE ────────────────────────────────────────────────────────────────

  const submitUserInformation = async (
    phone: string,
    college: string,
    name: string | null = userProfile.name
  ) => {
    try {
      const res = await updateUserInformation({ phone, college, name });
      if (res) {
        onUpdateProfile({
          ...userProfile,
          phone: profileForm.phone,
          college: profileForm.college,
          isProfileComplete: true,
        });
      }
    } catch (err) {
      console.error("Error submitting new data", err);
    }
  };

  // ─── PARTICIPANTS ───────────────────────────────────────────────────────────

  const handleParticipantChange = (
    eventId: string,
    teamId: string,
    index: number,
    field: keyof Participant,
    value: string
  ) => {
    setParticipants((prev) => {
      const updated = { ...prev };
      if (!updated[eventId]) updated[eventId] = {};
      if (!updated[eventId][teamId]) updated[eventId][teamId] = [];
      updated[eventId][teamId][index] = {
        ...(updated[eventId][teamId][index] || {
          name: "",
          email: "",
          phone: "",
          college: "",
        }),
        [field]: value,
      };
      return updated;
    });
  };

  const addSelfToEvent = (eventId: string, teamId: string) => {
    setParticipants((prev) => ({
      ...prev,
      [eventId]: {
        ...prev[eventId],
        [teamId]: [
          ...(prev[eventId]?.[teamId] || []),
          {
            name: userProfile.name || "",
            email: userProfile.email || "",
            phone: userProfile.phone || "",
            college: userProfile.college || "",
          },
        ],
      },
    }));
    setUserAddedToEvent((prev) => ({ ...prev, [eventId]: true }));
  };

  const addParticipant = (eventId: string, teamId: string) => {
    const event = getAllEvents(eventCategories).find((e) => e.eventID === eventId);
    const currentParticipants = participants[eventId]?.[teamId]?.length || 0;
    if (currentParticipants >= (event?.maximumNoOfParticipants || Infinity)) {
      alert("Maximum participant limit reached for this team.");
      return;
    }

    setParticipants((prev) => ({
      ...prev,
      [eventId]: {
        ...prev[eventId],
        [teamId]: [
          ...(prev[eventId]?.[teamId] || []),
          { name: "", email: "", phone: "", college: userProfile.college || "" },
        ],
      },
    }));
  };

  const addTeam = (eventId: string) => {
    setTeams((prev) => {
      const updated = { ...prev };
      const newTeamId = `Team ${(updated[eventId]?.length || 0) + 1}-${eventId}`;
      updated[eventId] = [...(updated[eventId] || []), newTeamId];
      return updated;
    });
    setEditMode((prev) => ({
      ...prev,
      [eventId]: {
        ...prev[eventId],
        [`Team ${(teams[eventId]?.length || 0) + 1}-${eventId}`]: true,
      },
    }));
  };

  const deleteParticipant = (eventId: string, teamId: string, index: number) => {
    setParticipants((prev) => {
      const updated = { ...prev };
      if (!updated[eventId]?.[teamId]) return updated;
      const participantToDelete = updated[eventId][teamId][index];
      updated[eventId][teamId] = updated[eventId][teamId].filter((_, i) => i !== index);
      if (participantToDelete?.email === userProfile.email) {
        setUserAddedToEvent((prevState) => ({ ...prevState, [eventId]: false }));
      }
      return updated;
    });
  };

  const deleteTeam = (eventId: string, teamId: string) => {
    setTeams((prev) => {
      const updated = { ...prev };
      updated[eventId] = updated[eventId]?.filter((team) => team !== teamId) || [];
      return updated;
    });

    setParticipants((prev) => {
      const updated = { ...prev };
      if (updated[eventId]?.[teamId]) {
        const userWasInTeam = updated[eventId][teamId].some(
          (p) => p.email === userProfile.email
        );
        delete updated[eventId][teamId];
        if (userWasInTeam) {
          setUserAddedToEvent((prevState) => ({ ...prevState, [eventId]: false }));
        }
      }
      return updated;
    });

    setEditMode((prev) => {
      const updated = { ...prev };
      if (updated[eventId]?.[teamId]) delete updated[eventId][teamId];
      return updated;
    });
  };

  const toggleEditMode = (eventId: string, teamId: string) => {
    const isCurrentlyEditing = editMode[eventId]?.[teamId] ?? true;

    if (isCurrentlyEditing) {
      const teamParticipants = participants[eventId]?.[teamId] || [];
      const hasEmptyFields = teamParticipants.some(
        (p) => !p.name || !p.email || !p.phone
      );

      if (hasEmptyFields && teamParticipants.length > 0) {
        alert("Please fill all participant details before saving");
        return;
      }
    }

    setEditMode((prev) => ({
      ...prev,
      [eventId]: {
        ...prev[eventId],
        [teamId]: !isCurrentlyEditing,
      },
    }));
  };

  const isAllSaved = () => {
    return selectedEvents.every((eventId) =>
      teams[eventId]?.every((team) => !(editMode[eventId]?.[team] ?? true))
    );
  };

  const getUnsavedEvents = () => {
    return selectedEvents
      .filter((eventId) =>
        teams[eventId]?.some((team) => editMode[eventId]?.[team] ?? true)
      )
      .map(
        (eventId) =>
          getAllEvents(eventCategories).find((e) => e.eventID === eventId)?.eventName ||
          eventId
      );
  };

  const handleSubmit = () => {
    const unsavedEvents = getUnsavedEvents();
    if (unsavedEvents.length > 0) {
      alert(
        `Please save all team details for these events:\n- ${unsavedEvents.join("\n- ")}`
      );
      return;
    }
    setShowOrderSummary(true);
  };

  // ─── PAYMENT ─────────────────────────────────────────────────────────────────

  const handlePaymentSelection = async (isCashPayment = false) => {
    try {
      // Calculate the correct discounted amount on the frontend
      const { total: finalAmount } = calculateTotalAmountWithDetails();

      if (isCashPayment) {
        // Pass finalAmount so backend doesn't recalculate
        await proceedToPay(participants, true, isContingent, finalAmount);
        setPaymentMethod("Pay at Desk");
        saveRegistrationData("Pay at Desk");
        window.location.href = "/success";
      } else {
        setIsLoadingOrder(true);
        // ⭐ Key fix: pass finalAmount to proceedToPay so backend uses our
        //    offer-applied amount instead of recalculating from raw DB prices.
        const order = await proceedToPay(participants, false, isContingent, finalAmount);
        setOrderData({
          orderNo: order.orderNo,
          amount: order.amount,
          razorpayOrderId: order.razorpayOrderId,
        });
        setPaymentMethod("Online");
        setIsLoadingOrder(false);
      }
    } catch (err) {
      alert("Error processing payment");
      setIsLoadingOrder(false);
    }
  };

  const handleProceedToPayment = () => {
    if (!orderData) return alert("Order not created");

    console.log("Opening Razorpay with:", orderData);

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: orderData.amount * 100,
      currency: "INR",
      name: "Kairos 2026",
      description: "Event Registration",
      order_id: orderData.razorpayOrderId,

      method: {
        upi: true,
        card: true,
        netbanking: true,
        wallet: true,
        paylater: true,
      },

      handler: async (response: any) => {
        try {
          const verifyRes = await fetch(
            `${import.meta.env.VITE_API_BASE_URL || "http://localhost:9000"}/payment/verifyOrder`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            }
          );

          const data = await verifyRes.json();

          if (verifyRes.ok) {
            console.log("Payment verified:", data);
            window.location.href = "/success";
          } else {
            console.error("Verification failed:", data);
            alert(data.status || "Payment verification failed");
          }
        } catch (err) {
          console.error("Verification API error:", err);
          alert("Server error during payment verification");
        }
      },

      prefill: {
        name: userProfile.name,
        email: userProfile.email,
        contact: userProfile.phone,
      },

      theme: { color: "#7C3AED" },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  // ─── HELPERS ─────────────────────────────────────────────────────────────────

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => alert(`Copied: ${text}`));
  };

  const saveRegistrationData = (method: string) => {
    const registeredEvents = selectedEvents.map((eventId, index) => {
      const event = getAllEvents(eventCategories).find((e) => e.eventID === eventId);
      return {
        id: `${eventId}-${Date.now()}-${index}`,
        name: event?.eventName,
        registrationDate: new Date().toLocaleDateString(),
        participants: participants[eventId] || {},
        teams: teams[eventId] || [],
        paymentMethod: method,
      };
    });

    const storedEvents = JSON.parse(localStorage.getItem("registeredEvents") || "[]");
    const updatedEvents = [...storedEvents, ...registeredEvents];
    localStorage.setItem("registeredEvents", JSON.stringify(updatedEvents));

    onUpdateProfile({ ...userProfile, registeredEvents: updatedEvents });

    setSelectedEvents([]);
    setSelectedEventsWithAmt([]);
    setParticipants({});
    setTeams({});
    setEditMode({});
    setUserAddedToEvent({});
    setIsContingent(false);
  };

  const truncateEmail = (email: string) => {
    if (email.length > 20) {
      return `${email.substring(0, 17)}...`;
    }
    return email;
  };

  // ─── OFFER LABEL (shown in UI) ───────────────────────────────────────────────

  const getOfferLabel = () => {
    const now = new Date();
    if (now > OFFER_DEADLINE) return null;

    const {
      isContingentOffer,
      isTechnicalOffer,
      isGamingOffer,
      isCulturalOffer,
    } = calculateTotalAmountWithDetails();

    if (isContingentOffer) return "Contingent Discount Applied (All Events - ₹2600)";

    const labels: string[] = [];
    if (isTechnicalOffer) labels.push("Technical Bundle (₹900)");
    if (isGamingOffer) labels.push("Gaming Bundle (₹700)");
    if (isCulturalOffer) labels.push("Cultural Bundle (₹1000)");

    return labels.length > 0 ? `Early Bird Offers: ${labels.join(", ")}` : null;
  };

  // ─── RENDER ──────────────────────────────────────────────────────────────────

  if (!userProfile.isProfileComplete) {
    return (
      <div className="max-w-md mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Complete Your Profile</h2>
        <div className="bg-gray-700 rounded-lg p-6 space-y-4">
          <p className="text-gray-300 mb-4">
            Please complete your profile information before registering for events.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                  })
                }
                className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                College Name
              </label>
              <input
                type="text"
                value={profileForm.college}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    college: e.target.value.replace(/\b\w/g, (char) => char.toUpperCase()),
                  })
                }
                className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                required
              />
            </div>
            <button
              onClick={() => {
                if (profileForm.phone && profileForm.college) {
                  submitUserInformation(profileForm.phone, profileForm.college);
                }
              }}
              className="w-full bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition-colors"
              disabled={!profileForm.phone || !profileForm.college}
            >
              Save Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showOrderSummary) {
    const offerLabel = getOfferLabel();

    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-gray-800 rounded-lg shadow-lg text-white">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center underline">
          Order Summary
        </h2>
        <div className="grid grid-cols-1 gap-6">
          {/* User Info */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-center mb-2">
              User Information
            </h3>
            <div className="bg-gray-700 p-4 rounded">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <p>
                  <span className="font-medium">Name:</span> {userProfile.name}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {userProfile.email}
                </p>
                <p>
                  <span className="font-medium">Phone:</span> {userProfile.phone}
                </p>
                <p>
                  <span className="font-medium">College:</span> {userProfile.college}
                </p>
              </div>
            </div>
          </div>

          {/* Selected Events */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-center mb-2">
              Selected Events
            </h3>
            <div className="space-y-4">
              {selectedEvents.map((eventId, index) => {
                const event = getAllEvents(eventCategories).find(
                  (e) => e.eventID === eventId
                );
                const teamCount = teams[eventId]?.length || 0;
                const eventTotal = calculateEventTotal(eventId);
                const totalParticipants = Object.values(
                  participants[eventId] || {}
                ).flat().length;

                return (
                  <div key={`${eventId}-${index}`} className="bg-gray-700 p-4 rounded">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                      <h4 className="text-base sm:text-lg font-medium">
                        {event?.eventName}
                      </h4>
                      <div className="flex items-center gap-2 text-sm sm:text-base">
                        {paymentMethod && (
                          <span className="bg-purple-600 text-white px-2 py-1 rounded">
                            {paymentMethod}
                          </span>
                        )}
                        <span className="bg-purple-600 text-white px-2 py-1 rounded">
                          {totalParticipants} Participant
                          {totalParticipants !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-300 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <p>Teams: {teamCount}</p>
                      <p>
                        Base: ₹{event?.registrationFee} × {teamCount} = ₹{eventTotal}
                      </p>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-base sm:text-lg font-medium mb-2">
                        Participants Details
                      </h4>
                      <div className="space-y-4">
                        {teams[eventId]?.map((team, teamIndex) => (
                          <div key={`${team}-${teamIndex}`}>
                            <h5 className="text-sm sm:text-md font-semibold mb-2">
                              Team: {team.split("-")[0]}
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {participants[eventId]?.[team]?.map(
                                (participant, pIndex) => (
                                  <div
                                    key={`${team}-${pIndex}`}
                                    className="mb-2 bg-gray-800 p-3 rounded"
                                  >
                                    <p>{participant.name}</p>
                                    <p
                                      className="truncate"
                                      title={participant.email}
                                    >
                                      {truncateEmail(participant.email)}
                                    </p>
                                    <p>{participant.phone}</p>
                                    <p>{participant.college}</p>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Total */}
          <div className="bg-gray-700 p-4 rounded">
            {offerLabel && (
              <p className="text-green-400 text-sm mb-2 text-center">✓ {offerLabel}</p>
            )}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-base sm:text-lg font-bold gap-2">
              <span>Total Amount:</span>
              <span className="text-purple-400">₹{calculateTotalAmount()}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={() => setShowPaymentOptions(true)}
              className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700 transition-colors w-full sm:w-auto"
              disabled={paymentMethod !== null}
            >
              Proceed to Payment
            </button>
            <button
              onClick={() => setShowOrderSummary(false)}
              className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors w-full sm:w-auto"
            >
              Back to Events
            </button>
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentOptions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-center flex-1">
                  Choose Payment Method
                </h2>
                <button
                  onClick={() => setShowPaymentOptions(false)}
                  className="text-white hover:text-purple-400 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {isLoadingOrder ? (
                  <div className="text-center py-8">
                    <svg
                      className="animate-spin h-8 w-8 text-purple-500 mx-auto mb-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <p>Generating your order ID...</p>
                  </div>
                ) : orderData && paymentMethod === "Online" ? (
                  <div className="space-y-4">
                    <p className="text-center text-sm text-gray-300">
                      Your discounted amount has been applied. Proceed to pay below.
                    </p>
                    {offerLabel && (
                      <p className="text-center text-sm text-green-400">✓ {offerLabel}</p>
                    )}
                    <div className="flex justify-between items-center bg-gray-700 p-3 rounded">
                      <span className="font-medium">Order Number:</span>
                      <div className="flex items-center gap-2">
                        <span>{orderData.orderNo}</span>
                        <button
                          onClick={() => copyToClipboard(orderData.orderNo.toString())}
                          className="text-purple-400 hover:text-purple-500 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center bg-gray-700 p-3 rounded">
                      <span className="font-medium">Total Amount:</span>
                      <div className="flex items-center gap-2">
                        {/* ⭐ This now shows the offer-applied amount from backend */}
                        <span className="text-purple-400 font-bold">
                          ₹{orderData.amount}
                        </span>
                        <button
                          onClick={() => copyToClipboard(`${orderData.amount}`)}
                          className="text-purple-400 hover:text-purple-500 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={handleProceedToPayment}
                      className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Proceed to Payment
                    </button>
                    <p className="text-center text-sm text-gray-300">
                      Please take a screenshot of the payment for future reference
                    </p>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => handlePaymentSelection(false)}
                      className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Pay Online
                    </button>
                    <button
                      onClick={() => handlePaymentSelection(true)}
                      className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Pay at Desk
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowPaymentOptions(false)}
                  className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="text-white p-4 sm:p-6">
      <div className="flex items-center justify-start mb-8">
        {showDetails && (
          <button
            onClick={() => setShowDetails(false)}
            className="text-white hover:text-purple-400 transition-colors mr-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
        )}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center">
          {showDetails ? "PARTICIPANT DETAILS" : "SELECT EVENTS"}
        </h1>
      </div>

      {!showDetails ? (
        <>
          <div className="mb-6 flex justify-center">
            <button
              onClick={handleContingentClick}
              className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition-colors w-full sm:w-auto"
            >
              Register for All Events (Contingent)
              {new Date() <= OFFER_DEADLINE && (
                <span className="ml-2 text-xs bg-yellow-400 text-black px-2 py-0.5 rounded">
                  Early Bird ₹2600
                </span>
              )}
            </button>
          </div>

          <div className="space-y-6">
            {Object.keys(eventCategories).map((category) => (
              <div key={category}>
                <button
                  className="w-full text-left text-lg sm:text-xl font-bold p-3 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
                  onClick={() =>
                    setExpandedCategory(
                      expandedCategory === category ? null : category
                    )
                  }
                >
                  {category}{" "}
                  {checkFullCategorySelected(category) &&
                    new Date() <= OFFER_DEADLINE && (
                      <span className="ml-2 text-xs bg-yellow-400 text-black px-2 py-0.5 rounded">
                        Bundle offer active
                      </span>
                    )}
                  {expandedCategory === category ? " -" : " +"}
                </button>
                {expandedCategory === category &&
                  eventCategories[category]?.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      {eventCategories[category].map((event) => (
                        <div
                          key={event.eventID}
                          className={`cursor-pointer transition-all duration-300 flex flex-col items-center p-4 rounded ${
                            selectedEvents.includes(event.eventID!)
                              ? "ring-4 ring-purple-500 bg-gray-700"
                              : "bg-gray-700 hover:bg-gray-600"
                          }`}
                          onClick={() =>
                            handleEventToggle(
                              event.eventID!,
                              event.registrationFee!,
                              event.maximumNoOfParticipants!
                            )
                          }
                        >
                          <img
                            src={event.img || ""}
                            alt={event.eventName}
                            className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded"
                          />
                          <h3 className="text-center mt-2 text-sm sm:text-lg">
                            {event.eventName}
                          </h3>
                          <p className="text-purple-400 mt-1 text-sm sm:text-base">
                            ₹{event.registrationFee}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </div>

          {selectedEvents.length > 0 && (
            <button
              onClick={() => setShowDetails(true)}
              className="bg-purple-600 text-white px-6 py-2 rounded block mx-auto mt-6 hover:bg-purple-700 transition-colors w-full sm:w-auto"
            >
              Next
            </button>
          )}
        </>
      ) : (
        selectedEvents.length > 0 && (
          <>
            <div className="space-y-6">
              {selectedEvents.map((eventId) => {
                const event = getAllEvents(eventCategories)?.find(
                  (e) => e.eventID === eventId
                );
                const teamCount = teams[eventId]?.length || 0;
                const eventTotal = calculateEventTotal(eventId);

                if (!teams[eventId]?.length) addTeam(eventId);

                return (
                  <div
                    key={eventId}
                    className="p-4 border border-gray-700 rounded bg-gray-700"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                      <h2 className="text-lg sm:text-xl font-bold">{event?.eventName}</h2>
                      <div className="text-purple-400 font-semibold text-sm sm:text-base">
                        Base: ₹{eventTotal} ({teamCount} teams × ₹
                        {event?.registrationFee})
                      </div>
                    </div>
                    <div className="space-y-4">
                      {teams[eventId]?.map((team, teamIndex) => (
                        <div key={`${team}-${teamIndex}`}>
                          <h3 className="text-base sm:text-lg font-bold">
                            {team.split("-")[0]}
                          </h3>
                          <div className="space-y-4 mt-2">
                            {participants[eventId]?.[team]?.map(
                              (participant, index) => (
                                <div
                                  key={`${team}-${index}`}
                                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                  <input
                                    type="text"
                                    placeholder="Co-participant Name"
                                    className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                    value={participant.name}
                                    onChange={(e) =>
                                      handleParticipantChange(
                                        eventId,
                                        team,
                                        index,
                                        "name",
                                        e.target.value
                                      )
                                    }
                                    disabled={!(editMode[eventId]?.[team] ?? true)}
                                  />
                                  <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                    value={participant.email}
                                    onChange={(e) =>
                                      handleParticipantChange(
                                        eventId,
                                        team,
                                        index,
                                        "email",
                                        e.target.value.toLowerCase()
                                      )
                                    }
                                    disabled={!(editMode[eventId]?.[team] ?? true)}
                                  />
                                  <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                    value={participant.phone}
                                    onChange={(e) =>
                                      handleParticipantChange(
                                        eventId,
                                        team,
                                        index,
                                        "phone",
                                        e.target.value.replace(/\D/g, "").slice(0, 10)
                                      )
                                    }
                                    disabled={!(editMode[eventId]?.[team] ?? true)}
                                  />
                                  {(editMode[eventId]?.[team] ?? true) && (
                                    <button
                                      onClick={() =>
                                        deleteParticipant(eventId, team, index)
                                      }
                                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors w-full md:w-auto"
                                    >
                                      Delete
                                    </button>
                                  )}
                                </div>
                              )
                            )}
                            <div className="flex flex-wrap gap-2">
                              {(editMode[eventId]?.[team] ?? true) && (
                                <>
                                  <button
                                    onClick={() => addParticipant(eventId, team)}
                                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
                                    disabled={
                                      (participants[eventId]?.[team]?.length || 0) >=
                                      (event?.maximumNoOfParticipants || Infinity)
                                    }
                                  >
                                    Add Participant
                                  </button>
                                  {!(userAddedToEvent[eventId] || false) && (
                                    <button
                                      onClick={() => addSelfToEvent(eventId, team)}
                                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                                      disabled={
                                        (participants[eventId]?.[team]?.length || 0) >=
                                        (event?.maximumNoOfParticipants || Infinity)
                                      }
                                    >
                                      Add Me
                                    </button>
                                  )}
                                  {!isContingent && (
                                    <button
                                      onClick={() => deleteTeam(eventId, team)}
                                      className="bg-red-600 text-white px-4 py-2 rounded transition-colors"
                                    >
                                      Delete Team
                                    </button>
                                  )}
                                </>
                              )}
                              <button
                                onClick={() => toggleEditMode(eventId, team)}
                                className={`${
                                  editMode[eventId]?.[team] ?? true
                                    ? "bg-yellow-600 hover:bg-yellow-700"
                                    : "bg-blue-600 hover:bg-blue-700"
                                } text-white px-4 py-2 rounded transition-colors`}
                              >
                                {editMode[eventId]?.[team] ?? true ? "Save" : "Edit"}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <button
                        onClick={() => addTeam(eventId)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                      >
                        Add Team
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live total with offer label */}
            <div className="bg-gray-800 p-4 rounded-lg my-6">
              {getOfferLabel() && (
                <p className="text-green-400 text-sm mb-2 text-center">
                  ✓ {getOfferLabel()}
                </p>
              )}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-base sm:text-lg font-bold gap-2">
                <span>Total Amount:</span>
                <span className="text-purple-400">₹{calculateTotalAmount()}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <button
                onClick={() => setShowDetails(false)}
                className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors w-full sm:w-auto"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                className={`${
                  isAllSaved()
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-purple-400 cursor-not-allowed"
                } text-white px-6 py-2 rounded transition-colors w-full sm:w-auto`}
                disabled={!isAllSaved()}
              >
                Submit
              </button>
            </div>
            {!isAllSaved() && (
              <div className="mt-4 p-3 bg-yellow-900 text-yellow-200 rounded text-center">
                <p>
                  Note — The Contingent Early Bird Offer is valid till 24th April 2026
                </p>
                <p>Please save all teams before submitting.</p>
                <p className="font-semibold mt-1">
                  Unsaved events: {getUnsavedEvents().join(", ")}
                </p>
              </div>
            )}
          </>
        )
      )}
    </div>
  );
};

export default EventRegistration;