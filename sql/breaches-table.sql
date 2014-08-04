use databreaches;

create table breaches (
    `id` int not null auto_increment primary key,
    `guid` int,
    `public_date` datetime,
    `name` varchar(255),
    `entity` varchar(5),
    `type` varchar(10),
    `street` varchar(255),
    `city` varchar(255),
    `state` varchar(255),
    `postal` varchar(10),
    `country` varchar(100),
    `records_ssn` int,
    `records_all` int,
    `description` longtext,
    `source` varchar(255),
    `year` int,
    `note` longtext,
    `url` varchar(255)
);