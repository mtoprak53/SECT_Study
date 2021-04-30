
DROP DATABASE IF EXISTS medical_center;

CREATE DATABASE medical_center;

\c medical_center

CREATE TABLE doctors (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(15) NOT NULL,
  last_name VARCHAR(20)
);

CREATE TABLE patients (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(15) NOT NULL,
  last_name VARCHAR(20)
);

CREATE TABLE diseases (
  id SERIAL PRIMARY KEY,
  name VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE doctor_patient (
  id SERIAL PRIMARY KEY,
  doctor_id INTEGER REFERENCES doctors ON DELETE CASCADE,
  patient_id INTEGER REFERENCES patients ON DELETE CASCADE
);

CREATE TABLE patients_diseases (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER REFERENCES patients ON DELETE CASCADE,
  disease_id INTEGER REFERENCES diseases ON DELETE CASCADE
)