import adminModels from "../models/adminModels.js";

const getWorkers = async (req, res) => {
  try {
    const workers = await adminModels.getWorkers();

    const formattedWorkers = workers.map((worker) => ({
      professional_id: worker.professional_id,
      user_id: worker.user_id,

      name: `${worker.first_name} ${worker.last_name}`,

      role: worker.service_name || "General Handyman",

      city: worker.city || "Not provided",

      slug: `${worker.first_name}-${worker.last_name}`
        .toLowerCase()
        .replace(/\s+/g, "-"),

      email: worker.email,
      phone: worker.phone,
      hourly_rate: worker.hourly_rate,
      verification_status: worker.verification_status,
      availability_status: worker.availability_status,
      profile_image: worker.profile_image,
    }));

    res.json(formattedWorkers);
  } catch (error) {
    console.error("Get workers error:", error);

    res.status(500).json({
      message: "Failed to load workers",
      error: error.message,
    });
  }
};

const getStats = async (req, res) => {
  try {
    const stats = await adminModels.getAdminStats();

    res.json({
      total_workers: Number(stats.total_workers) || 0,
      total_customers: Number(stats.total_customers) || 0,
      total_bookings: Number(stats.total_bookings) || 0,
      total_revenue: Number(stats.total_revenue) || 0,
    });
  } catch (error) {
    console.error("Get admin stats error:", error);

    res.status(500).json({
      message: "Failed to load admin statistics",
      error: error.message,
    });
  }
};

const getWorkerActivity = async (req, res) => {
  try {
    const activity = await adminModels.getWorkerActivity();

    res.json({
      active: Number(activity.active) || 0,
      completed: Number(activity.completed) || 0,
      pending: Number(activity.pending) || 0,
    });
  } catch (error) {
    console.error("Get worker activity error:", error);

    res.status(500).json({
      message: "Failed to load worker activity",
      error: error.message,
    });
  }
};

const getWorkerServices = async (req, res) => {
  try {
    const services = await adminModels.getWorkerServices();

    res.json(
      services.map((service) => ({
        service_name: service.service_name,
        worker_count: Number(service.worker_count) || 0,
      })),
    );
  } catch (error) {
    console.error("Get worker services error:", error);

    res.status(500).json({
      message: "Failed to load worker service statistics",
      error: error.message,
    });
  }
};

const getBookingStatus = async (req, res) => {
  try {
    const statuses = await adminModels.getBookingStatus();

    res.json(
      statuses.map((status) => ({
        status: status.status,
        booking_count: Number(status.booking_count) || 0,
      })),
    );
  } catch (error) {
    console.error("Get booking status error:", error);

    res.status(500).json({
      message: "Failed to load booking statistics",
      error: error.message,
    });
  }
};

const getBookingsByService = async (req, res) => {
  try {
    const services = await adminModels.getBookingsByService();

    res.json(
      services.map((service) => ({
        service_name: service.service_name,
        booking_count: Number(service.booking_count) || 0,
      })),
    );
  } catch (error) {
    console.error("Get bookings by service error:", error);

    res.status(500).json({
      message: "Failed to load booking service statistics",
      error: error.message,
    });
  }
};

const removeWorker = async (req, res) => {
  try {
    const professionalId = Number(req.params.id);

    if (!professionalId) {
      return res.status(400).json({
        message: "Invalid professional ID",
      });
    }

    const deleted = await adminModels.deleteWorker(professionalId);

    if (!deleted) {
      return res.status(404).json({
        message: "Worker not found",
      });
    }

    res.json({
      message: "Worker deleted successfully",
    });
  } catch (error) {
    console.error("Delete worker error:", error);

    res.status(500).json({
      message: "Unable to delete worker. They may have related bookings.",
    });
  }
};

// ============================================================
// PENDING VERIFICATIONS
// ============================================================

const getPendingVerificationsController = async (req, res) => {
  try {
    const pending = await adminModels.getPendingVerifications();

    const formatted = pending.map((row) => ({
      professional_id: row.professional_id,
      user_id: row.user_id,

      name: `${row.first_name} ${row.last_name}`,

      email: row.email,
      phone: row.phone,

      city: row.city || "Not provided",
      service_name: row.service_name || "Not provided",

      verification_status: row.verification_status,
      created_at: row.created_at,
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Get pending verifications error:", error);

    res.status(500).json({
      message: "Failed to load pending verifications",
      error: error.message,
    });
  }
};

// ============================================================
// VERIFICATION DETAILS
// ============================================================

const getVerificationDetailsController = async (req, res) => {
  try {
    const professionalId = Number(req.params.professionalId);

    if (!professionalId) {
      return res.status(400).json({
        message: "Invalid professional ID",
      });
    }

    const details = await adminModels.getVerificationDetails(professionalId);

    if (!details) {
      return res.status(404).json({
        message: "Professional not found",
      });
    }

    res.json(details);
  } catch (error) {
    console.error("Get verification details error:", error);

    res.status(500).json({
      message: "Failed to load verification details",
      error: error.message,
    });
  }
};

const approveVerificationController = async (req, res) => {
  try {
    const professionalId = Number(req.params.professionalId);

    if (!professionalId) {
      return res.status(400).json({
        message: "Invalid professional ID",
      });
    }

    // Look up the user_id for this professional
    const details = await adminModels.getVerificationDetails(professionalId);

    if (!details) {
      return res.status(404).json({
        message: "Professional not found",
      });
    }

    const userId = details.profile.user_id;

    // Update both tables
    await adminModels.updateVerificationStatus(professionalId, "verified");
    await adminModels.updateDocumentsStatus(userId, "approved");

    res.json({
      message: "Worker approved successfully",
      professional_id: professionalId,
      user_id: userId,
      verification_status: "verified",
    });
  } catch (error) {
    console.error("Approve verification error:", error);

    res.status(500).json({
      message: "Failed to approve worker",
      error: error.message,
    });
  }
};

const rejectVerificationController = async (req, res) => {
  try {
    const professionalId = Number(req.params.professionalId);

    if (!professionalId) {
      return res.status(400).json({
        message: "Invalid professional ID",
      });
    }

    const details = await adminModels.getVerificationDetails(professionalId);

    if (!details) {
      return res.status(404).json({
        message: "Professional not found",
      });
    }

    const userId = details.profile.user_id;

    await adminModels.updateVerificationStatus(professionalId, "rejected");
    await adminModels.updateDocumentsStatus(userId, "rejected");

    res.json({
      message: "Worker rejected",
      professional_id: professionalId,
      user_id: userId,
      verification_status: "rejected",
    });
  } catch (error) {
    console.error("Reject verification error:", error);

    res.status(500).json({
      message: "Failed to reject worker",
      error: error.message,
    });
  }
};

export {
  getWorkers,
  getStats,
  getWorkerActivity,
  getWorkerServices,
  getBookingStatus,
  getBookingsByService,
  removeWorker,
  getPendingVerificationsController,
  getVerificationDetailsController,
  approveVerificationController,
  rejectVerificationController
};
