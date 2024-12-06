DROP DATABASE IF EXISTS garage;
CREATE DATABASE garage;

USE garage;

CREATE TABLE permit_info (
	permit_id int,
    first_name varchar(20),
    last_name varchar(20),
    permit_type varchar(20),
    valid_until date,
    PRIMARY KEY (permit_id)
);

CREATE TABLE car_info (
    car_id int,
    permit_id int,
    license_plate varchar(20),
    car_make varchar(20),
    car_model varchar(20),
    car_year int,
    car_color varchar(20),
    parked boolean,
    PRIMARY KEY (car_id),
    FOREIGN KEY (permit_id) REFERENCES permit_info(permit_id)
);

INSERT INTO permit_info (permit_id, first_name, last_name, permit_type, valid_until)
VALUES (000491075, 'Bob', 'Walker', 'Semester_Overnight', '2023-05-18'),
(000499865, 'Jason', 'Bulp', 'Semester_Overnight', '2023-05-18'),
(000493269, 'Teresa', 'Bear', 'Semester_Day', '2023-05-18'),
(000491005, 'Stacy', 'Big', 'Semester_Overnight', '2023-05-18'),
(000501073, 'Tyrone', 'Bigums', 'Faculty', '2023-05-18'),
(000491213, 'Bruce', 'Wayne', 'Semester_Overnight', '2023-05-18'),
(000493369, 'Truman', 'Capote', 'Semester_Day', '2023-05-18'),
(000491071, 'Biggie', 'Smalls', 'Semester_Overnight', '2022-12-18'),
(000498989, 'Greatest', 'Alive', 'Semester_Day', '2022-12-18'),
(000503379, 'Walsh', 'Walshy', 'Faculty', '2023-05-18'),
(000505000, 'Ankur', 'Agrawal', 'Faculty', '2023-05-18'),
(000504721, 'John', 'Smith', 'Semester_Overnight', '2023-05-18'),
(000506934, 'Samantha', 'Johnson', 'Visitor', '2023-05-18'),
(000506239, 'Emily', 'Wilson', 'Visitor', '2023-05-18'),
(000504320, 'David', 'Lee', 'Semester_Overnight', '2022-12-18'),
(000508002, 'Sophia', 'Kim', 'Faculty', '2023-05-18'),
(000503111, 'Mark', 'Davis', 'Semester_Day', '2023-05-18'),
(000505111, 'Natalie', 'Jackson', 'Visitor', '2023-05-18'),
(000503322, 'Michael', 'Brown', 'Semester_Overnight', '2023-05-18'),
(000504401, 'Amanda', 'Garcia', 'Visitor', '2022-12-18'),
(000507509, 'Ryan', 'Martinez', 'Semester_Overnight', '2023-05-18'),
(000508768, 'Kayla', 'Johnson', 'Faculty', '2023-05-18'),
(000501921, 'Christopher', 'Clark', 'Semester_Day', '2023-05-18'),
(000502352, 'Sarah', 'Lewis', 'Visitor', '2022-12-18'),
(000503831, 'Joshua', 'Robinson', 'Semester_Overnight', '2023-05-18');

INSERT INTO car_info (car_id, permit_id, license_plate, car_make, car_model, car_year, car_color, parked)
VALUES (1, 000491075, 'BIGDRE', 'Dodge', 'Caliber', 2007, 'White', false),
(2, 000499865, 'KNU7768', 'Ford', 'Focus', 2012, 'Black', false),
(3, 000499865, 'HF78BLL', 'Subaru', 'Outback', 2013, 'Blue', true),
(4, 000493269, 'MUN9L3D', 'Ford', 'Escape', 2017, 'Red', false),
(5, 000493269, '98HN5FG', 'Dodge', 'Eclipse', 2017, 'Blue', true),
(6, 000491005, 'BUT9BUM', 'Audi', 'A9', 2022, 'White', false),
(7, 000501073, '1BN7FD5', 'Honda', 'Civic', 2013, 'Silver', false),
(8, 000491213, 'BATMAN0', 'Bat', 'Mobile', 1960, 'Black', false),
(9, 000493369, 'AK74BH0', 'Ford', 'Model-T', 1954, 'Black', false),
(10, 000491071, 'NMU7OLP', 'Lexus', 'LS', 2018, 'White', false),
(11, 000498989, 'BIG55YA', 'Chevy', 'Volt', 2019, 'Silver', false),
(12, 000503379, 'YA098L9', 'Honda', 'CRV', 2017, 'Yellow', true),
(13, 000505000, 'CMPTY00', 'School', 'Bus', 3000, 'Yellow', false),
(14, 000505000, 'FB550YX', 'School', 'Bus', 3000, 'Yellow', false),
(15, 000505000, 'PYTH0N3', 'School', 'Bus', 3000, 'Yellow', true),
(16, 000503322, 'ABC1234', 'Toyota', 'Corolla', 2015, 'Gray', false),
(17, 000503322, 'JHG4321', 'Volkswagen', 'Jetta', 2018, 'Red', true),
(18, 000503322, 'JKL5678', 'Jeep', 'Wrangler', 2020, 'Green', false),
(19, 000504320, 'MNO9012', 'Chevrolet', 'Impala', 2013, 'Black', true),
(20, 000504320, 'PQR3456', 'Nissan', 'Sentra', 2017, 'White', false),
(21, 000504320, 'STU7890', 'Toyota', 'Camry', 2016, 'Silver', true),
(22, 000491071, 'VWX2345', 'Honda', 'Accord', 2014, 'Black', false),
(23, 000491071, 'YZA6789', 'Subaru', 'Forester', 2019, 'Blue', false),
(24, 000491071, 'BCD0123', 'Ford', 'Fusion', 2012, 'Gray', true),
(25, 000501921, 'EFG4567', 'Dodge', 'Charger', 2021, 'White', false),
(26, 000501921, 'HIJ8901', 'Tesla', 'Model S', 2022, 'Red', false),
(27, 000501921, 'KLM2345', 'Audi', 'Q5', 2018, 'Gray', true),
(28, 000501921, 'NOP6789', 'Chevrolet', 'Equinox', 2020, 'Blue', false),
(29, 000501921, 'JKL9144', 'Subaru', 'Forester', 2015, 'Silver', false),
(30, 000501921, 'QRS1234', 'Toyota', 'Highlander', 2017, 'Black', false);
