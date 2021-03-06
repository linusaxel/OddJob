create table "USER" (
id bigint auto_increment primary key,
email varchar(50),
password varchar(100),
first_name varchar(50),
last_name varchar(50),
phone varchar(50),
profile_pic varchar(1000),
description varchar(1000)
);

create table Application (
id bigint auto_increment primary key,
job_id bigint,
applicant_id bigint,
status varchar(50),
applicant_msg varchar(1000)
);

create table Job (
id bigint auto_increment primary key,
title varchar(50),
description varchar(140),
location_id bigint,
job_pic varchar(1000),
price decimal,
owner_id bigint,
"DATE" varchar(40)
);

create table Location (
id bigint auto_increment primary key,
street varchar(50),
zip_code varchar(50),
city varchar(50),
country varchar(50),
lat decimal,
lng decimal
)