CREATE DATABASE IF NOT EXISTS yenza_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE yenza_db;

CREATE TABLE categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE handymen (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  job_title VARCHAR(160) NOT NULL,
  category_id INT UNSIGNED NOT NULL,
  rating DECIMAL(2,1) NOT NULL,
  review_count INT UNSIGNED NOT NULL DEFAULT 0,
  hourly_rate_zar DECIMAL(10,2) NOT NULL,
  CONSTRAINT chk_handyman_rating CHECK (rating BETWEEN 0 AND 5),
  CONSTRAINT chk_handyman_rate CHECK (hourly_rate_zar >= 0),
  CONSTRAINT fk_handymen_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE services (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE handyman_services (
  handyman_id INT UNSIGNED NOT NULL,
  service_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (handyman_id, service_id),
  CONSTRAINT fk_handyman_services_handyman
    FOREIGN KEY (handyman_id) REFERENCES handymen(id) ON DELETE CASCADE,
  CONSTRAINT fk_handyman_services_service
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

INSERT INTO categories (id, name) VALUES
  (1, 'Plumber'),
  (2, 'Carpenter'),
  (3, 'Electrician'),
  (4, 'Painter'),
  (5, 'Locksmith'),
  (6, 'HVAC Technician'),
  (7, 'Roofer'),
  (8, 'General Handyman');

INSERT INTO handymen (id, full_name, job_title, category_id, rating, review_count, hourly_rate_zar) VALUES
  (1, 'Arthur Pendleton', 'Master Plumber & Pipe Specialist', 1, 4.9, 124, 85.00),
  (2, 'Marcus Vance', 'Expert Cabinetry & Framing Carpenter', 2, 4.8, 96, 75.00),
  (3, 'Sarah Jenkins', 'Licensed Residential Electrician', 3, 5.0, 83, 90.00),
  (4, 'Elena Rodriguez', 'Interior & Exterior Painting Specialist', 4, 4.9, 108, 72.00),
  (5, 'Daniel Okafor', '24/7 Residential & Auto Locksmith', 5, 4.9, 147, 70.00),
  (6, 'Maya Collins', 'Certified Security Lock Specialist', 5, 4.8, 78, 82.00),
  (7, 'Owen Hart', 'Emergency Locksmith & Key Expert', 5, 4.7, 112, 65.00),
  (8, 'Priya Naidoo', 'Licensed HVAC Installation Technician', 6, 5.0, 91, 95.00),
  (9, 'Ethan Brooks', 'Heating & Cooling Service Expert', 6, 4.8, 134, 88.00),
  (10, 'Lerato Mokoena', 'Commercial HVAC Systems Technician', 6, 4.9, 66, 110.00),
  (11, 'Jacob Miles', 'Roof Repair & Waterproofing Pro', 7, 4.9, 156, 86.00),
  (12, 'Thabo Dlamini', 'Residential Roofing Contractor', 7, 4.8, 103, 92.00),
  (13, 'Nina Patel', 'Metal & Flat Roof Specialist', 7, 4.7, 74, 89.00),
  (14, 'Carlos Mendes', 'Reliable Home Repair Handyman', 8, 4.9, 119, 60.00),
  (15, 'Aisha Williams', 'Multi-Skilled Home Services Pro', 8, 4.8, 87, 68.00),
  (16, 'Ben Carter', 'General Repairs & Installation', 8, 4.7, 98, 58.00);

INSERT INTO services (id, name) VALUES
  (1, 'Emergency Repair'), (2, 'Leaky Pipes'), (3, 'Commercial'),
  (4, 'Furniture Assembly'), (5, 'Custom Decks'), (6, 'Drywall'),
  (7, 'Wiring'), (8, 'Smart Home'), (9, 'Lighting Installation'),
  (10, 'Interior Painting'), (11, 'Feature Walls'), (12, 'Exterior Finishes'),
  (13, 'Lockout Service'), (14, 'Key Cutting'), (15, 'Rekeying'),
  (16, 'Smart Locks'), (17, 'Security Upgrades'), (18, 'Safe Opening'),
  (19, 'Emergency Callout'), (20, 'Car Keys'), (21, 'Lock Repair'),
  (22, 'AC Installation'), (23, 'Heat Pumps'), (24, 'Ventilation'),
  (25, 'AC Repair'), (26, 'Furnace Service'), (27, 'Maintenance'),
  (28, 'Ductwork'), (29, 'Diagnostics'), (30, 'Commercial HVAC'),
  (31, 'Leak Repair'), (32, 'Waterproofing'), (33, 'Tile Roofing'),
  (34, 'Roof Replacement'), (35, 'Gutters'), (36, 'Inspections'),
  (37, 'Flat Roofs'), (38, 'Metal Roofing'), (39, 'Storm Damage'),
  (40, 'Minor Repairs'), (41, 'Mounting'), (42, 'Home Maintenance'),
  (43, 'Painting'), (44, 'Fixtures'), (45, 'Furniture Repair'),
  (46, 'Shelving'), (47, 'Door Repair'), (48, 'Caulking');

INSERT INTO handyman_services (handyman_id, service_id) VALUES
  (1,1), (1,2), (1,3), (2,4), (2,5), (2,6), (3,7), (3,8), (3,9),
  (4,10), (4,11), (4,12), (5,13), (5,14), (5,15), (6,16), (6,17), (6,18),
  (7,19), (7,20), (7,21), (8,22), (8,23), (8,24), (9,25), (9,26), (9,27),
  (10,28), (10,29), (10,30), (11,31), (11,32), (11,33), (12,34), (12,35), (12,36),
  (13,37), (13,38), (13,39), (14,40), (14,41), (14,42), (15,43), (15,44), (15,45),
  (16,46), (16,47), (16,48);
