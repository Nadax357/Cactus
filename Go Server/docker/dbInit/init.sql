
CREATE TABLE metricType
(
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(60) NOT NULL,
    `unit` VARCHAR(10) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE reading
(
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `value` int(11) NOT NULL,
    `metricTypeId` int(11) NOT NULL,
    `timestamp` timestamp NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (metricTypeId) REFERENCES metricType(id)
);

/* INSERT INTO metric (`name`, `unit`) VALUES ('CPU Usage', '%');
INSERT INTO metric (`name`, `unit`) VALUES ('Memory Usage', '%');
INSERT INTO metric (`name`, `unit`) VALUES ('CPU Temperature', 'C°'); */