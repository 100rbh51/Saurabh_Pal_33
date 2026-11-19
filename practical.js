const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

let registrations = [
  {
    id: 501,
    participantName: "Riya Sharma",
    eventName: "Tech Fest",
    department: "CSE",
    ticketCount: 2,
    paymentStatus: "Paid"
  },
  {
    id: 502,
    participantName: "Arjun Mehta",
    eventName: "Code Sprint",
    department: "IT",
    ticketCount: 3,
    paymentStatus: "Pending"
  },
  {
    id: 503,
    participantName: "Neha Verma",
    eventName: "Tech Fest",
    department: "ECE",
    ticketCount: 1,
    paymentStatus: "Paid"
  }
];

function isValidRegistration(data) {
  return (
    data &&
    typeof data.participantName === "string" &&
    data.participantName.trim() !== "" &&
    typeof data.eventName === "string" &&
    data.eventName.trim() !== "" &&
    typeof data.department === "string" &&
    data.department.trim() !== "" &&
    Number.isInteger(data.ticketCount) &&
    data.ticketCount > 0 &&
    ["Paid", "Pending"].includes(data.paymentStatus)
  );
}

function nextId() {
  return registrations.length === 0
    ? 501
    : Math.max(...registrations.map(registration => registration.id)) + 1;
}

app.get("/api/registrations", (req, res) => {
  res.status(200).json(registrations);
});

app.post("/api/registrations", (req, res) => {
  if (!isValidRegistration(req.body)) {
    return res.status(400).json({
      message: "Invalid input. Provide all required fields, a positive integer ticketCount, and paymentStatus as Paid or Pending."
    });
  }

  const newRegistration = {
    id: nextId(),
    participantName: req.body.participantName.trim(),
    eventName: req.body.eventName.trim(),
    department: req.body.department.trim(),
    ticketCount: req.body.ticketCount,
    paymentStatus: req.body.paymentStatus
  };

  registrations.push(newRegistration);
  res.status(201).json(newRegistration);
});

app.get("/api/registrations/filter", (req, res) => {
  const department = req.query.department;

  if (typeof department !== "string") {
    return res.status(200).json([]);
  }

  const matchingRegistrations = registrations.filter(
    registration =>
      registration.department.toLowerCase() === department.toLowerCase()
  );

  res.status(200).json(matchingRegistrations);
});

app.get("/api/registrations/pending", (req, res) => {
  const pendingRegistrations = registrations.filter(
    registration => registration.paymentStatus === "Pending"
  );

  res.status(200).json(pendingRegistrations);
});

app.get("/api/registrations/:id", (req, res) => {
  const id = Number(req.params.id);
  const registration = registrations.find(item => item.id === id);

  if (!registration) {
    return res.status(404).json({ message: "Registration not found" });
  }

  res.status(200).json(registration);
});

app.put("/api/registrations/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = registrations.findIndex(item => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Registration not found" });
  }

  if (!isValidRegistration(req.body)) {
    return res.status(400).json({
      message: "Invalid input. Provide all required fields, a positive integer ticketCount, and paymentStatus as Paid or Pending."
    });
  }

  registrations[index] = {
    id,
    participantName: req.body.participantName.trim(),
    eventName: req.body.eventName.trim(),
    department: req.body.department.trim(),
    ticketCount: req.body.ticketCount,
    paymentStatus: req.body.paymentStatus
  };

  res.status(200).json(registrations[index]);
});

app.delete("/api/registrations/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = registrations.findIndex(item => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Registration not found" });
  }

  registrations.splice(index, 1);
  res.status(200).json({ message: "Registration deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});