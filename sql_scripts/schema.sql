DROP DATABASE IF EXISTS akura;
CREATE DATABASE akura;
USE akura;

CREATE TABLE `assignment` (
  `assID` varchar(20) DEFAULT NULL,
  `subID` varchar(10) DEFAULT NULL,
  `stID` varchar(10) DEFAULT NULL,
  `result` int(11) DEFAULT NULL
);

CREATE TABLE `attendance` (
  `aID` int(11) NOT NULL,
  `stuID` varchar(10) DEFAULT NULL,
  `subID` varchar(5) DEFAULT NULL,
  `date` datetime DEFAULT NULL
);

CREATE TABLE `comments` (
  `cID` int(11) NOT NULL,
  `comment` varchar(100) NOT NULL,
  `postID` int(11) NOT NULL,
  `postedAt` datetime NOT NULL,
  `author` varchar(20) NOT NULL,
  `subID` varchar(20) NOT NULL,
  `authorName` varchar(50) DEFAULT NULL
);

CREATE TABLE `content` (
  `contentID` varchar(15) NOT NULL DEFAULT '',
  `section` varchar(20) DEFAULT NULL,
  `title` varchar(20) DEFAULT NULL,
  `description` varchar(30) DEFAULT NULL,
  `subID` varchar(5) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `accResponse` varchar(1) NOT NULL DEFAULT 'n',
  `dueDate` date DEFAULT NULL,
  `dueTime` time DEFAULT NULL
);

CREATE TABLE `course_topics` (
  `topicID` int(11) NOT NULL,
  `lecID` varchar(20) DEFAULT NULL,
  `subID` varchar(20) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL
);

CREATE TABLE `discussion_posts` (
  `postID` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `descr` varchar(200) NOT NULL,
  `subID` varchar(20) NOT NULL,
  `sub_sec` varchar(100) NOT NULL,
  `postedAt` datetime NOT NULL,
  `author` varchar(20) NOT NULL,
  `authorName` varchar(50) DEFAULT NULL
);

CREATE TABLE `enrolment` (
  `subID` varchar(20) NOT NULL DEFAULT '',
  `stID` varchar(20) NOT NULL DEFAULT '',
  `average` int(11) DEFAULT '0'
);

CREATE TABLE `lecturer` (
  `lecID` varchar(20) NOT NULL DEFAULT '',
  `nic` varchar(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `tele` int(9) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `qualification` varchar(150) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `login` int(11) DEFAULT '0'
);

CREATE TABLE `parent` (
  `paID` varchar(20) NOT NULL,
  `stID` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `teleres` int(9) NOT NULL,
  `telemob` int(9) NOT NULL,
  `email` varchar(50) NOT NULL,
  `relationship` varchar(100) NOT NULL
);

CREATE TABLE `payment` (
  `pID` int(11) NOT NULL,
  `date` date DEFAULT NULL,
  `month` varchar(10) DEFAULT NULL,
  `amount` float DEFAULT NULL,
  `stID` varchar(20) DEFAULT NULL,
  `subID` varchar(20) DEFAULT NULL,
  `year` int(4) DEFAULT NULL
);

CREATE TABLE `sch_changes` (
  `sch_ID` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `content` varchar(200) NOT NULL,
  `created` datetime NOT NULL
);

CREATE TABLE `student` (
  `stID` varchar(20) NOT NULL DEFAULT '',
  `name` varchar(100) DEFAULT NULL,
  `school` varchar(100) DEFAULT NULL,
  `teleres` int(9) DEFAULT NULL,
  `telemob` int(9) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `gender` varchar(6) DEFAULT NULL,
  `address` varchar(150) DEFAULT NULL,
  `ALyear` int(4) DEFAULT NULL,
  `login` int(11) DEFAULT '0'
);

CREATE TABLE `subject` (
  `subID` varchar(20) NOT NULL DEFAULT '',
  `subname` varchar(100) NOT NULL,
  `medium` char(1) NOT NULL,
  `hall` varchar(30) NOT NULL,
  `fromTime` time DEFAULT NULL,
  `toTime` time DEFAULT NULL,
  `year` varchar(10) DEFAULT NULL,
  `day` varchar(20) NOT NULL,
  `lecID` varchar(20) NOT NULL,
  `fee` double DEFAULT NULL
);

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `lastLogin` datetime DEFAULT NULL
);

ALTER TABLE `assignment`
  ADD KEY `subID` (`subID`),
  ADD KEY `stID` (`stID`);

ALTER TABLE `attendance`
  ADD PRIMARY KEY (`aID`),
  ADD KEY `stuID` (`stuID`),
  ADD KEY `subID` (`subID`);

ALTER TABLE `comments`
  ADD PRIMARY KEY (`cID`),
  ADD KEY `fk_comments` (`postID`),
  ADD KEY `fk_comments_sub` (`subID`);

ALTER TABLE `content`
  ADD PRIMARY KEY (`contentID`),
  ADD KEY `subID` (`subID`);

ALTER TABLE `course_topics`
  ADD PRIMARY KEY (`topicID`),
  ADD KEY `lecID` (`lecID`),
  ADD KEY `subID` (`subID`);

ALTER TABLE `discussion_posts`
  ADD PRIMARY KEY (`postID`),
  ADD KEY `subID` (`subID`);

ALTER TABLE `enrolment`
  ADD PRIMARY KEY (`subID`,`stID`),
  ADD KEY `stID` (`stID`);

ALTER TABLE `lecturer`
  ADD PRIMARY KEY (`lecID`);

ALTER TABLE `parent`
  ADD PRIMARY KEY (`paID`,`stID`);

ALTER TABLE `payment`
  ADD PRIMARY KEY (`pID`),
  ADD KEY `stID` (`stID`),
  ADD KEY `subID` (`subID`);

ALTER TABLE `sch_changes`
  ADD PRIMARY KEY (`sch_ID`);

ALTER TABLE `student`
  ADD PRIMARY KEY (`stID`);

ALTER TABLE `subject`
  ADD PRIMARY KEY (`subID`);

ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `attendance`
  MODIFY `aID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

ALTER TABLE `comments`
  MODIFY `cID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

ALTER TABLE `course_topics`
  MODIFY `topicID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `discussion_posts`
  MODIFY `postID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

ALTER TABLE `payment`
  MODIFY `pID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=209;

ALTER TABLE `sch_changes`
  MODIFY `sch_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=92;

ALTER TABLE `assignment`
  ADD CONSTRAINT `assignment_ibfk_1` FOREIGN KEY (`subID`) REFERENCES `subject` (`subID`),
  ADD CONSTRAINT `assignment_ibfk_2` FOREIGN KEY (`stID`) REFERENCES `student` (`stID`);

ALTER TABLE `attendance`
  ADD CONSTRAINT `attendance_ibfk_2` FOREIGN KEY (`subID`) REFERENCES `subject` (`subID`);

ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`postID`) REFERENCES `discussion_posts` (`postID`),
  ADD CONSTRAINT `fk_comments` FOREIGN KEY (`postID`) REFERENCES `discussion_posts` (`postID`),
  ADD CONSTRAINT `fk_comments_sub` FOREIGN KEY (`subID`) REFERENCES `subject` (`subID`);

ALTER TABLE `content`
  ADD CONSTRAINT `content_ibfk_1` FOREIGN KEY (`subID`) REFERENCES `subject` (`subID`);

ALTER TABLE `course_topics`
  ADD CONSTRAINT `course_topics_ibfk_1` FOREIGN KEY (`lecID`) REFERENCES `lecturer` (`lecID`),
  ADD CONSTRAINT `course_topics_ibfk_2` FOREIGN KEY (`subID`) REFERENCES `subject` (`subID`);

ALTER TABLE `discussion_posts`
  ADD CONSTRAINT `discussion_posts_ibfk_1` FOREIGN KEY (`subID`) REFERENCES `subject` (`subID`);

ALTER TABLE `enrolment`
  ADD CONSTRAINT `enrolment_ibfk_1` FOREIGN KEY (`subID`) REFERENCES `subject` (`subID`),
  ADD CONSTRAINT `enrolment_ibfk_2` FOREIGN KEY (`stID`) REFERENCES `student` (`stID`);

ALTER TABLE `payment`
  ADD CONSTRAINT `payment_ibfk_2` FOREIGN KEY (`subID`) REFERENCES `subject` (`subID`);


/**
 * Inventory schema
 */
create table item (
	itID int auto_increment primary key,
    description varchar(255),
    unit varchar(50),
    receivedQty int default 0,
    issuedQty int default 0,
    inStockQty int generated always as (receivedQty - issuedQty),
    remarks varchar(255)
);

create table received_item (
	rcitID int auto_increment primary key,
    itID int,
    qty int,
    date datetime default now(),
    remarks varchar(255),
    foreign key (itID) references item(itID) on delete cascade
);

create table issued_item (
	isitID int auto_increment primary key,
    itID int,
    qty int,
    date datetime default now(),
    remarks varchar(255),
    foreign key (itID) references item(itID) on delete cascade
);

create table issue_request (
	reqID int auto_increment primary key,
    itID int,
    subID varchar(20),
    qty int,
    date datetime default now(),
    accepted bool default false,
    pending bool default true,
    foreign key(itID) references item(itID) on delete cascade,
    foreign key(subID) references subject(subID)
);

delimiter $$
create trigger update_receivedQty
	after insert
    on received_item for each row
begin
	update item
	set receivedQty = (select sum(qty) from received_item where itID = new.itID)
	where itID = new.itID;
end$$

create trigger update_issued_item
	after insert
    on issued_item for each row
begin
	update item
    set issuedQty = (select sum(qty) from issued_item where itId = new.itID)
    where itID = new.itID;
end$$

create procedure accept_request (in reqID int, in remarks varchar(255))
begin
	declare _itID, _qty int;
	update issue_request
    set accepted = true, pending = false
    where issue_request.reqID=reqID;
    set _itID = (select itID from issue_request where issue_request.reqID=reqID);
    set _qty = (select qty from issue_request where issue_request.reqID=reqID);
    insert into issued_item(itID, qty, remarks)
    values (_itID, _qty, remarks);
end$$

create procedure deny_request (in reqID int)
begin
	update issue_request
    set accepted = false, pending = false
    where issue_request.reqID=reqID;
end$$
delimiter ;